package plsql

import (
	"context"
	"io"
	"os"
	"testing"

	"github.com/pkg/errors"
	"github.com/stretchr/testify/require"
	"gopkg.in/yaml.v3"

	"github.com/bytebase/bytebase/backend/common"
	"github.com/bytebase/bytebase/backend/plugin/parser/base"
	"github.com/bytebase/bytebase/backend/store/model"
	storepb "github.com/bytebase/bytebase/proto/generated-go/store"
)

func TestGetQuerySpan(t *testing.T) {
	type testCase struct {
		Description       string `yaml:"description,omitempty"`
		Statement         string `yaml:"statement,omitempty"`
		ConnectedDatabase string `yaml:"connectedDatabase,omitempty"`
		// Metadata is the protojson encoded storepb.DatabaseSchemaMetadata,
		// if it's empty, we will use the defaultDatabaseMetadata.
		Metadata  string              `yaml:"metadata,omitempty"`
		QuerySpan *base.YamlQuerySpan `yaml:"querySpan,omitempty"`
	}

	const (
		record       = false
		testDataPath = "test-data/query_span.yaml"
	)

	a := require.New(t)
	yamlFile, err := os.Open(testDataPath)
	a.NoError(err)

	var testCases []testCase
	byteValue, err := io.ReadAll(yamlFile)
	a.NoError(err)
	a.NoError(yamlFile.Close())
	a.NoError(yaml.Unmarshal(byteValue, &testCases))

	for i, tc := range testCases {
		metadata := &storepb.DatabaseSchemaMetadata{}
		a.NoError(common.ProtojsonUnmarshaler.Unmarshal([]byte(tc.Metadata), metadata))
		databaseMetadataGetter, databaseNamesLister, linkedDatabaseMetadataGetter := buildMockDatabaseMetadataGetter([]*storepb.DatabaseSchemaMetadata{metadata})
		result, err := GetQuerySpan(context.TODO(), base.GetQuerySpanContext{
			GetDatabaseMetadataFunc:       databaseMetadataGetter,
			ListDatabaseNamesFunc:         databaseNamesLister,
			GetLinkedDatabaseMetadataFunc: linkedDatabaseMetadataGetter,
		}, tc.Statement, tc.ConnectedDatabase, tc.ConnectedDatabase, false)
		a.NoError(err)
		a.NotNil(result)
		resultYaml := result.ToYaml()
		if record {
			testCases[i].QuerySpan = resultYaml
		} else {
			a.Equal(tc.QuerySpan, resultYaml, "statement: %s", tc.Statement)
		}
	}

	if record {
		byteValue, err := yaml.Marshal(testCases)
		a.NoError(err)
		err = os.WriteFile(testDataPath, byteValue, 0644)
		a.NoError(err)
	}
}

func buildMockDatabaseMetadataGetter(databaseMetadata []*storepb.DatabaseSchemaMetadata) (base.GetDatabaseMetadataFunc, base.ListDatabaseNamesFunc, base.GetLinkedDatabaseMetadataFunc) {
	return func(_ context.Context, databaseName string) (string, *model.DatabaseMetadata, error) {
			m := make(map[string]*model.DatabaseMetadata)
			for _, metadata := range databaseMetadata {
				m[metadata.Name] = model.NewDatabaseMetadata(metadata)
			}

			if databaseMetadata, ok := m[databaseName]; ok {
				return databaseName, databaseMetadata, nil
			}

			return "", nil, errors.Errorf("database %q not found", databaseName)
		}, func(_ context.Context) ([]string, error) {
			names := make([]string, 0, len(databaseMetadata))
			for _, metadata := range databaseMetadata {
				names = append(names, metadata.Name)
			}
			return names, nil
		}, func(_ context.Context, linkedDatabaseName, _ string) (string, *model.DatabaseMetadata, error) {
			var linkedDBInfo *storepb.LinkedDatabaseMetadata
			for _, metadata := range databaseMetadata {
				for _, linkedDatabase := range metadata.GetLinkedDatabases() {
					if linkedDatabase.Name == linkedDatabaseName {
						linkedDBInfo = linkedDatabase
						break
					}
				}
				if linkedDBInfo != nil {
					break
				}
			}
			if linkedDBInfo == nil {
				return "", nil, errors.Errorf("linked database %q not found", linkedDatabaseName)
			}

			for _, metadata := range databaseMetadata {
				if metadata.Name == linkedDBInfo.Username {
					return metadata.Name, model.NewDatabaseMetadata(metadata), nil
				}
			}

			return "", nil, errors.Errorf("database %q not found", linkedDBInfo.Username)
		}
}
