package api

const (
	// DefaultProjectUID is the UID for the default project.
	DefaultProjectUID = 1
	// DefaultProjectID is the resource ID for the default project.
	DefaultProjectID = "default"

	// Below are defined in LATEST_DATA.sql.

	// DefaultTestEnvironmentID is the initial resource ID for the test environment.
	// This can be mutated by the user. But for now this is only used by onboarding flow to create
	// a test instance after first signup, so it's safe to refer it.
	DefaultTestEnvironmentID = "test"
	// DefaultTestEnvironmentUID is the initial resource UID for the test environment.
	DefaultTestEnvironmentUID = 101

	// DefaultProdEnvironmentID is the initial resource ID for the prod environment.
	// This can be mutated by the user. But for now this is only used by onboarding flow to create
	// a prod instance after first signup, so it's safe to refer it.
	DefaultProdEnvironmentID = "prod"
	// DefaultProdEnvironmentUID is the initial resource UID for the prod environment.
	DefaultProdEnvironmentUID = 102
)
