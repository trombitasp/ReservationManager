package trombitasp.ReservationManager.email

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.mail.SimpleMailMessage
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.stereotype.Service

@Service
class EmailSenderService(
    @Autowired
    private val mailSender: JavaMailSender
) {
    public fun sendSimpleEmail(toEmail: String, body: String, subject: String) {
        val message = SimpleMailMessage()
        message.setFrom("zmgtrombitasp@gmail.com");
        message.setTo(toEmail);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
        println("email sent to " + toEmail)
    }
}