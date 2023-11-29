package trombitasp.ReservationManager.controller

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import trombitasp.ReservationManager.email.EmailSenderService
import trombitasp.ReservationManager.email.EmailServiceImpl

@RestController
@RequestMapping("/api")
@CrossOrigin
class EmailController(
    @Autowired
    private val emailSenderService: EmailSenderService
) {

    @GetMapping("/email")
    fun findAllResource() = sendMessage()

    private fun sendMessage(): Any {
        emailSenderService.sendSimpleEmail("t.peter2000@gmail.com", "test", "send email from code")
        return true
    }
}