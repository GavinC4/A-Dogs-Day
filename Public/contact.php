<?php
$errors = '';
$myemail = 'cnsgalaxygroup@gmail.com';//<-----Put Your email address here.
$name = $_GET['name'];
$email = $_GET['email'];
$message = $_GET['message'];

    $to = $myemail;
    $email_subject = "Contact form submission: $name";
    $email_body = "You have received a new message. ".
        " Here are the details:\n Name: $name \n Email: $email \n Message: \n $message";

    $headers .= "Content-type:text/html; charset=iso-8859-1\r\n";
    $headers = "From: $email\n";
    $headers .= "Reply-To: $email";

    mail($to,$email_subject,$email_body,$headers);
    //redirect to the 'thank you' page
    header('Location: contact-form-thank-you.html');

?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <title>Contact form handler</title>
</head>

<body>
<!-- This page is displayed only if there is some error -->
<?php
echo nl2br($errors);
?>


</body>
</html>