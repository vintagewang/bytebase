// Package dbfactory includes the database driver factory.
package dbfactory

import (
	"context"

	"github.com/bytebase/bytebase/backend/common"
	"github.com/bytebase/bytebase/backend/component/secret"
	api "github.com/bytebase/bytebase/backend/legacyapi"
	"github.com/bytebase/bytebase/backend/plugin/db"
	"github.com/bytebase/bytebase/backend/store"
	"github.com/bytebase/bytebase/backend/utils"
	storepb "github.com/bytebase/bytebase/proto/generated-go/store"
)

// DBFactory is the factory for building database driver.
type DBFactory struct {
	mysqlBinDir string
	pgBinDir    string
	mongoBinDir string
	dataDir     string
	secret      string
}

// New creates a new database driver factory.
func New(mysqlBinDir, mongoBinDir, pgBinDir, dataDir, secret string) *DBFactory {
	return &DBFactory{
		mysqlBinDir: mysqlBinDir,
		mongoBinDir: mongoBinDir,
		pgBinDir:    pgBinDir,
		dataDir:     dataDir,
		secret:      secret,
	}
}

// GetAdminDatabaseDriver gets the admin database driver using the instance's admin data source.
// Upon successful return, caller must call driver.Close(). Otherwise, it will leak the database connection.
func (d *DBFactory) GetAdminDatabaseDriver(ctx context.Context, instance *store.InstanceMessage, database *store.DatabaseMessage, connectionContext db.ConnectionContext) (db.Driver, error) {
	dataSource := utils.DataSourceFromInstanceWithType(instance, api.Admin)
	if dataSource == nil {
		return nil, common.Errorf(common.Internal, "admin data source not found for instance %q", instance.Title)
	}
	databaseName := ""
	if database != nil {
		databaseName = database.DatabaseName
	}
	datashare := false
	if database != nil && database.DataShare {
		datashare = true
	}
	if instance.Engine == storepb.Engine_ORACLE && database != nil && database.ServiceName != "" {
		// For Oracle, we map CDB as instance and PDB as database.
		// The instance data source is the data source for CDB.
		// So, if the database is not nil, which means we want to connect the PDB, we need to override the database name, service name, and sid.
		dataSource = dataSource.Copy()
		dataSource.Database = database.DatabaseName
		dataSource.ServiceName = database.ServiceName
		dataSource.SID = ""
		databaseName = database.DatabaseName
	}
	return d.GetDataSourceDriver(ctx, instance, dataSource, databaseName, datashare, false /* readOnly */, connectionContext)
}

// GetReadOnlyDatabaseDriver gets the read-only database driver using the instance's read-only data source.
// If the read-only data source is not defined, we will fallback to admin data source.
// Upon successful return, caller must call driver.Close(). Otherwise, it will leak the database connection.
func (d *DBFactory) GetReadOnlyDatabaseDriver(ctx context.Context, instance *store.InstanceMessage, database *store.DatabaseMessage, dataSourceID string) (db.Driver, error) {
	dataSource, databaseName, err := d.GetReadOnlyDatabaseSource(instance, database, dataSourceID)
	if err != nil {
		return nil, err
	}
	dataShare := false
	if database != nil {
		dataShare = database.DataShare
	}
	return d.GetDataSourceDriver(ctx, instance, dataSource, databaseName, dataShare, true /* readOnly */, db.ConnectionContext{})
}

// GetReadOnlyDatabaseSource returns the read-only data source for the given instance and database.
func (*DBFactory) GetReadOnlyDatabaseSource(instance *store.InstanceMessage, database *store.DatabaseMessage, dataSourceID string) (*store.DataSourceMessage, string, error) {
	var dataSource *store.DataSourceMessage
	if dataSourceID == "" {
		dataSource = utils.DataSourceFromInstanceWithType(instance, api.RO)
		adminDataSource := utils.DataSourceFromInstanceWithType(instance, api.Admin)
		// If there are no read-only data source, fall back to admin data source.
		if dataSource == nil {
			dataSource = adminDataSource
		}
	} else {
		for _, ds := range instance.DataSources {
			if ds.ID == dataSourceID {
				dataSource = ds
				break
			}
		}
	}
	if dataSource == nil {
		return nil, "", common.Errorf(common.Internal, "data source not found for instance %q", instance.Title)
	}

	databaseName := ""
	if database != nil {
		databaseName = database.DatabaseName
	}
	if instance.Engine == storepb.Engine_ORACLE && database != nil && database.ServiceName != "" {
		// For Oracle, we map CDB as instance and PDB as database.
		// The instance data source is the data source for CDB.
		// So, if the database is not nil, which means we want to connect the PDB, we need to override the database name, service name, and sid.
		dataSource = dataSource.Copy()
		dataSource.Database = database.DatabaseName
		dataSource.ServiceName = database.ServiceName
		dataSource.SID = ""
		databaseName = database.DatabaseName
	}

	return dataSource, databaseName, nil
}

// GetDataSourceDriver returns the database driver for a data source.
func (d *DBFactory) GetDataSourceDriver(ctx context.Context, instance *store.InstanceMessage, dataSource *store.DataSourceMessage, databaseName string, datashare, readOnly bool, connectionContext db.ConnectionContext) (db.Driver, error) {
	dbBinDir := ""
	switch instance.Engine {
	case storepb.Engine_MYSQL, storepb.Engine_TIDB, storepb.Engine_MARIADB, storepb.Engine_OCEANBASE:
		// TODO(d): use maria mysqlbinlog for MariaDB.
		dbBinDir = d.mysqlBinDir
	case storepb.Engine_POSTGRES, storepb.Engine_RISINGWAVE:
		dbBinDir = d.pgBinDir
	case storepb.Engine_MONGODB:
		dbBinDir = d.mongoBinDir
	}

	if databaseName == "" {
		databaseName = dataSource.Database
	}
	connectionDatabase := ""
	if datashare {
		connectionDatabase = dataSource.Database
	}
	password, err := common.Unobfuscate(dataSource.ObfuscatedPassword, d.secret)
	if err != nil {
		return nil, err
	}
	sslCA, err := common.Unobfuscate(dataSource.ObfuscatedSslCa, d.secret)
	if err != nil {
		return nil, err
	}
	sslCert, err := common.Unobfuscate(dataSource.ObfuscatedSslCert, d.secret)
	if err != nil {
		return nil, err
	}
	sslKey, err := common.Unobfuscate(dataSource.ObfuscatedSslKey, d.secret)
	if err != nil {
		return nil, err
	}
	sshPassword, err := common.Unobfuscate(dataSource.SSHObfuscatedPassword, d.secret)
	if err != nil {
		return nil, err
	}
	sshPrivateKey, err := common.Unobfuscate(dataSource.SSHObfuscatedPrivateKey, d.secret)
	if err != nil {
		return nil, err
	}
	authenticationPrivateKey, err := common.Unobfuscate(dataSource.AuthenticationPrivateKeyObfuscated, d.secret)
	if err != nil {
		return nil, err
	}
	masterPassword, err := common.Unobfuscate(dataSource.MasterName, d.secret)
	if err != nil {
		return nil, err
	}

	updatedPassword, err := secret.ReplaceExternalSecret(ctx, password, dataSource.ExternalSecret)
	if err != nil {
		return nil, err
	}
	password = updatedPassword
	sshConfig := db.SSHConfig{
		Host:       dataSource.SSHHost,
		Port:       dataSource.SSHPort,
		User:       dataSource.SSHUser,
		Password:   sshPassword,
		PrivateKey: sshPrivateKey,
	}
	var dbSaslConfig db.SASLConfig
	switch t := dataSource.SASLConfig.GetMechanism().(type) {
	case *storepb.SASLConfig_KrbConfig:
		dbSaslConfig = &db.KerberosConfig{
			Primary:  t.KrbConfig.Primary,
			Instance: t.KrbConfig.Instance,
			Realm: db.Realm{
				Name:                 t.KrbConfig.Realm,
				KDCHost:              t.KrbConfig.KdcHost,
				KDCPort:              t.KrbConfig.KdcPort,
				KDCTransportProtocol: t.KrbConfig.KdcTransportProtocol,
			},
			Keytab: t.KrbConfig.Keytab,
		}
	default:
		dbSaslConfig = nil
	}
	connectionContext.InstanceID = instance.ResourceID
	connectionContext.EngineVersion = instance.EngineVersion
	driver, err := db.Open(
		ctx,
		instance.Engine,
		db.DriverConfig{
			DbBinDir: dbBinDir,
		},
		db.ConnectionConfig{
			Username: dataSource.Username,
			Password: password,
			TLSConfig: db.TLSConfig{
				UseSSL:  dataSource.UseSSL,
				SslCA:   sslCA,
				SslCert: sslCert,
				SslKey:  sslKey,
			},
			Host:                     dataSource.Host,
			Port:                     dataSource.Port,
			Database:                 databaseName,
			ConnectionDatabase:       connectionDatabase,
			SRV:                      dataSource.SRV,
			AuthenticationDatabase:   dataSource.AuthenticationDatabase,
			SID:                      dataSource.SID,
			ServiceName:              dataSource.ServiceName,
			SSHConfig:                sshConfig,
			ReadOnly:                 readOnly,
			ConnectionContext:        connectionContext,
			AuthenticationPrivateKey: authenticationPrivateKey,
			AuthenticationType:       dataSource.AuthenticationType,
			SASLConfig:               dbSaslConfig,
			AdditionalAddresses:      dataSource.AdditionalAddresses,
			ReplicaSet:               dataSource.ReplicaSet,
			DirectConnection:         dataSource.DirectConnection,
			Region:                   dataSource.Region,
			AccountID:                dataSource.AccountID,
			WarehouseID:              dataSource.WarehouseID,
			RedisType:                dataSource.RedisType,
			MasterName:               dataSource.MasterName,
			MasterUsername:           dataSource.MasterUsername,
			MasterPassword:           masterPassword,
		},
	)
	if err != nil {
		return nil, err
	}

	return driver, nil
}
