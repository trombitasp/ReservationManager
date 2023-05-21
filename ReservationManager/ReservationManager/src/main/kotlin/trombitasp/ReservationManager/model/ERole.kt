package trombitasp.ReservationManager.model

enum class ERole {
    ADMIN,      // mindenhez van joga
    LOGGED_IN,  // be van jelentkezve, tud foglalásokat tenni
    DEFAULT,    // csak nézni tudja az erőforrásokat, nem tud foglalni
}