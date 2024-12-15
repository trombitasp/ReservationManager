package trombitasp.ReservationManager.model

enum class ERole {
    DEFAULT,    // csak nézni tudja az erőforrásokat, nem tud foglalni
    LOGGED_IN,  // be van jelentkezve, tud foglalásokat tenni
    ADMIN,      // mindenhez van joga
}