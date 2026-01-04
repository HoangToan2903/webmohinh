package mohinh.com.webmohinh_backend.service;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    // Email mặc định sẽ được gửi từ địa chỉ cấu hình trong application.properties
    public void sendEmail(String to, String subject, String text) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            message.setFrom("hoangductoan290803@gmail.com");
            System.out.println(mailSender);
            mailSender.send(message);
            System.out.println("Email Sent Successfully to: " + to);
        } catch (MailException e) {
            e.printStackTrace();
            // Xử lý lỗi (ví dụ: log lỗi, throw exception)
            throw new RuntimeException("Error sending email: " + e.getMessage());
        }
    }
    public void sendEmailHtml(String to, String subject, String htmlContent) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true); // HTML mode = true

            mailSender.send(message);

        } catch (Exception e) {
            throw new RuntimeException("Cannot send email: " + e.getMessage());
        }
    }
}
