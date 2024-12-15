rootProject.name = "ReservationManager"
include("src:integration-tests")
findProject(":src:integration-tests")?.name = "integration-tests"
