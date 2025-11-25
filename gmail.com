<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $first = $_POST['first_name'];
    $last = $_POST['last_name'];
    $email = $_POST['email'];
    $subject = $_POST['subject'];
    $message = nl2br($_POST['message']);

    $to = "udaykumarborale9@gmail.com";
    $full_subject = "Portfolio Contact Form: " . $subject;

    $body = "
        <h2>New Message From Portfolio Website</h2>
        <p><strong>Name:</strong> $first $last</p>
        <p><strong>Email:</strong> $email</p>
        <p><strong>Subject:</strong> $subject</p>
        <p><strong>Message:</strong><br>$message</p>
    ";

    $headers = "From: $email\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "Content-type: text/html\r\n";

    if (mail($to, $full_subject, $body, $headers)) {
        echo "SUCCESS: Message sent!";
    } else {
        echo "ERROR: Message failed to send.";
    }
}
?>
