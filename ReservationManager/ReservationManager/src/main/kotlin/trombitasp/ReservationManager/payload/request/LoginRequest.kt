package trombitasp.ReservationManager.payload.request

import jakarta.validation.constraints.NotBlank

class LoginRequest {
    @NotBlank
    var username: String? = null

    @NotBlank
    var password: String? = null
}