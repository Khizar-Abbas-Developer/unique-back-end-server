export const contactFormTemplate = (firstName, lastName, email, phone, message) => {
  const year = new Date().getFullYear();
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Contact Form Submission</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f8f9fa;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    .header {
      background-color: #2563eb;
      color: #ffffff;
      text-align: center;
      padding: 20px;
    }
    .header h2 {
      margin: 0;
      font-size: 20px;
    }
    .content {
      padding: 20px;
      color: #333333;
    }
    .content p {
      margin: 8px 0;
    }
    .content strong {
      color: #111827;
    }
    .footer {
      background-color: #f1f5f9;
      text-align: center;
      padding: 15px;
      font-size: 12px;
      color: #6b7280;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>📩 New Contact Form Submission</h2>
    </div>
    <div class="content">
      <p><strong>First Name:</strong> {{firstName}}</p>
      <p><strong>Last Name:</strong> {{lastName}}</p>
      <p><strong>Email:</strong> {{email}}</p>
      <p><strong>Contact Number:</strong> {{contactNumber}}</p>
      <p><strong>Message:</strong></p>
      <p>{{message}}</p>
    </div>
    <div class="footer">
      <p>This email was generated automatically from your website's contact form.</p>
    </div>
  </div>
</body>
</html>

  `;
};
