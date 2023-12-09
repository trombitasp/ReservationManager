package trombitasp.ReservationManager.payload.request

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

class SignupRequest {
    @NotBlank
    @Size(min = 3, max = 20)
    var username: String? = null

    @NotBlank
    @Size(max = 50)
    @Email
    var email: String? = null

    var role: Set<String> = HashSet()

    @NotBlank
    @Size(min = 6, max = 40)
    var password: String? = null
}