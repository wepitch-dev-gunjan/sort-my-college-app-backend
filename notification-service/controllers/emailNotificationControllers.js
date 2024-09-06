const fs = require("fs");
const axios = require("axios");
const { transporter } = require("../services/emailService");
const { validationResult } = require("express-validator");
require("dotenv").config();
const { BACKEND_URL } = process.env;
exports.generatedOtpNotification = (req, res) => {
  try {
    // Validate the request parameters
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { to, otp } = req.body;

    const mailOptions = {
      to,
      subject: "OTP verification",
      html: `
      <body>
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td align="center" bgcolor="#ffffff">
              <table border="0" cellpadding="0" cellspacing="0" width="600">
                <!-- Header Section -->
                <tr>
                  <td align="center" valign="top">
                    <a href="https://sortmycollege.com/">
                      <img
                        src="https://sortmycollege.com/wp-content/uploads/2023/05/SORTMYCOLLEGE-12.png"
                        alt=""
                        width="200"
                        height="50"
                      />
                    </a>
                  </td>
                </tr>
  
                <!-- Content Section -->
                <tr>
                  <td align="center">
                    <h1
                      style="
                        font-family: 'Arial', 'Helvetica', sans-serif;
                        font-size: 24px;
                        color: #1f0a68;
                      "
                    >
                      Welcome to
                      <a
                        href="https://sortmycollege.com/"
                        style="
                          color: #1f0a68;
                          font-weight: 700;
                          text-decoration: none;
                        "
                      >
                        SortMyCollege
                      </a>
                    </h1>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p
                      style="
                        font-family: 'Arial', 'Helvetica', sans-serif;
                        font-size: 16px;
                        color: #333;
                      "
                    >
                      Dear ${to},<br /><br />
                      <!-- You can insert the OTP dynamically here -->
                      Your OTP is: <b>${otp}</b><br /><br />
                      We're delighted to have you join our community of
                      individuals seeking support, guidance, and personal growth.
                      At
                      <a
                        href="https://sortmycollege.com/"
                        style="
                          color: #1f0a68;
                          font-weight: 700;
                          text-decoration: none;
                        "
                      >
                        SortMyCollege
                      </a>, we understand that life can present its challenges...
                      <!-- Continue customizing the email content as needed -->
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ error: "Error sending email" });
      } else {
        console.log("Email sent:", info.response);
        res.json({ message: "Email sent successfully" });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.verifiedOtpNotification = (req, res) => {
  try {
    const { to } = req.body;

    if (!to) {
      return res.status(400).json({ error: "Email is required" });
    }

    const mailOptions = {
      from: "your@email.com", // Set your "from" email address
      to,
      subject: "Account Verified",
      html: `
        <body>
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td align="center" bgcolor="#ffffff">
                <table border="0" cellpadding="0" cellspacing="0" width="600">
                  <!-- Header Section -->
                  <tr>
                    <td align="center" valign="top">
                      <a href="https://sortmycollege.com/">
                        <img
                          src="https://sortmycollege.com/wp-content/uploads/2023/05/SORTMYCOLLEGE-12.png"
                          alt=""
                          width="200"
                          height="50"
                        />
                      </a>
                    </td>
                  </tr>
    
                  <!-- Content Section -->
                  <tr>
                    <td align="center">
                      <h1
                        style="
                          font-family: 'Arial', 'Helvetica', sans-serif;
                          font-size: 24px;
                          color: #1f0a68;
                        "
                      >
                        Account Verified
                      </h1>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p
                        style="
                          font-family: 'Arial', 'Helvetica', sans-serif;
                          font-size: 16px;
                          color: #333;
                        "
                      >
                        Dear User,
                        <br /><br />
                        Your account has been successfully verified.
                        <br /><br />
                        Thank you for choosing our service. You can now access all the features and benefits of your verified account.
                        <br /><br />
                        Best regards,
                        <br />
                        Sort My College
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ error: "Error sending email" });
      } else {
        console.log("Email sent:", info.response);
        res.json({ message: "Email sent successfully" });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.welcomeUserEmailNotification = (req, res) => {
  try {
    const { to, subject, username } = req.body;
    console.log(req.body);
    const mailOptions = {
      to,
      subject,
      html: `<body>
      <table border="0" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td align="center" bgcolor="#ffffff">
          <table border="0" cellpadding="0" cellspacing="0" width="600">
            <tr>
              <td align="center" valign="top">
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td align="center" style="padding: 25px">
                      <a href="https://sortmycollege.com/">
                        <img
                          src="https://sortmycollege.com/wp-content/uploads/2023/05/SORTMYCOLLEGE-12.png"
                          alt=""
                          width="200"
                          height="50"
                        />
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td align="center">
                      <h1
                        style="
                          font-family: Georgia, 'Times New Roman', Times, serif;
                          font-size: 3vh;
                          color: black;
                        "
                      >
                        Welcome to
                        <a
                          href="https://sortmycollege.com/"
                          style="
                            color: #1f0a68;
                            font-weight: 700;
                            text-decoration: none;
                          "
                        >
                          SortMyCollege
                        </a>
                      </h1>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p
                        style="
                          font-family: Georgia, 'Times New Roman', Times, serif;
                          font-size: 2.5vh;
                          color: black;
                        "
                      >
                        Dear ${username},<br /><br />
                        We're delighted to have you join our community of
                        individuals seeking support, guidance, and personal
                        growth. At
                        <a
                          href="https://sortmycollege.com/"
                          style="
                            color: #1f0a68;
                            font-weight: 700;
                            text-decoration: none;
                          "
                        >
                          SortMyCollege </a
                        >, we understand that life can present its challenges,
                        and taking the step to seek counseling is a powerful
                        one. <br /><br />
                        Our dedicated team of experienced counselors are here to
                        provide you with a safe and confidential space where you
                        can explore your thoughts, feelings, and concerns.
                        Whether you're looking for help with managing stress,
                        improving relationships, coping with life transitions,
                        or working on personal development, we're here to
                        support you every step of the way. <br /><br />
                        Feel free to explore our platform, browse our counselor
                        profiles, and schedule your first appointment when
                        you're ready to begin your counseling journey. Remember,
                        seeking help is a sign of strength, and you are not
                        alone in this journey. <br /><br />
                        If you have any questions or need assistance, our
                        support team is here to help. Once again, welcome to
                        <a
                          href="https://sortmycollege.com/"
                          style="
                            color: #1f0a68;
                            font-weight: 700;
                            text-decoration: none;
                          "
                        >
                          SortMyCollege </a
                        >, where your well-being is our priority. <br /><br />
                        We look forward to supporting you on your path to a
                        happier and healthier life. <br /><br />
                        Best regards, <br />
                        The
                        <a
                          href="https://sortmycollege.com/"
                          style="
                            color: #1f0a68;
                            font-weight: 700;
                            text-decoration: none;
                          "
                        >
                          SortMyCollege
                        </a>
                        Team
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    </body>`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        res.status(500).send("Error sending email");
      } else {
        console.log("Email sent:", info.response);
        res.send("Email sent successfully");
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

exports.welcomeCounsellorEmailNotification = (req, res) => {
  try {
    const { from, to, subject, username } = req.body;
    console.log(req.body);
    const mailOptions = {
      from,
      to,
      subject,
      html: `<body>
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
        <tr>
          <td style="box-sizing: border-box; padding: 25px; margin: 10px;">
            <table width="100%" border="1" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
              <tr>
                <td align="center" bgcolor="#ffffff">
                  <table width="700" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
                    <tr>
                      <td align="center">
                        <a href="https://sortmycollege.com/">
                          <img src="https://sortmycollege.com/wp-content/uploads/2023/05/SORTMYCOLLEGE-12.png" alt="" width="200" height="50" style="display: block;">
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td align="center">
                        <h1 style="font-family: Georgia, 'Times New Roman', Times, serif; font-size: 3vh; color: black;">
                          Welcome to
                          <a href="https://sortmycollege.com/" style="color: #1f0a68; font-weight: 700; text-decoration: none;">SortMyCollege</a>
                        </h1>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <p style="font-size: 2vh; font-family: Georgia; color: black; font-size: 2vh; font-family: Georgia; color: black; font-size: 2vh; font-family: Georgia; color: black;">
                          Dear ${username}, <br /><br />
                          We are thrilled to have you join our platform as a counselor. Your dedication to helping others is truly commendable, and we are excited to have you as part of our growing community <br /><br />
                          As a counselor on our platform, you play a vital role in providing support, guidance, and understanding to individuals seeking your expertise. Whether you are an experienced professional or just starting your counseling journey, you are a valued member of our team, and your contributions will make a difference in the lives of those you assist. <br /><br />
                          Thank you for choosing
                          <a href="https://sortmycollege.com/" style="color: #1f0a68; font-weight: 700; text-decoration: none;">SortMyCollege</a>
                          to share your expertise and make a positive impact on the mental well-being of others. We are here to support you every step of the way. <br /><br />
                          If you have any questions or need assistance with your profile setup or any other aspect of our platform, please don't hesitate to reach out. Together, we can create a healthier, happier world. <br /><br />
                          Best regards, <br />
                          The
                          <a href="https://sortmycollege.com/" style="color: #1f0a68; font-weight: 700; text-decoration: none;">SortMyCollege</a>
                          Team
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    `,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        res.status(500).send("Error sending email");
      } else {
        console.log("Email sent:", info.response);
        res.send("Email sent successfully");
      }
    });
    console.log("running");
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

exports.bookedSessionUserEmailNotification = async (req, res) => {
  try {
    const {
      to,
      date,
      time,
      counsellor,
      sessiontype,
      duration,
      // location,
      payment,
      // subject,
      username,
    } = req.body;
    console.log(req.body);

    const mailOptions = {
      date,
      time,
      counsellor,
      sessiontype,
      duration,
      // location,
      payment,
      to,
      // subject,
      html: `<body>
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
        <tr>
          <td style="box-sizing: border-box; padding: 25px; margin: 10px;">
            <table width="100%" border="1" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
              <tr>
                <td align="center" bgcolor="#ffffff">
                  <table width="400" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
                    <tr>
                      <td align="center">
                        <a href="https://sortmycollege.com/">
                          <img src="https://sortmycollege.com/wp-content/uploads/2023/05/SORTMYCOLLEGE-12.png" alt="" width="400" height="100" style="display: block;">
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td align="center">
                        <h1 style="font-family: Georgia, 'Times New Roman', Times, serif; font-size: 3vh; color: black;">
                          Welcome to
                          <a href="https://sortmycollege.com/" style="color: #1f0a68; font-weight: 700; text-decoration: none;">SortMyCollege</a>
                        </h1>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <p style="font-size: 2vh; font-family: Georgia; color: black;">
                          Hello ${username} <br><br>
                          We're thrilled to confirm your counseling session booking! Here are the details: <br><br>
                          <table border="0" cellspacing="0" cellpadding="0" style="font-size: 2vh; font-family: Georgia; color: black;">
                            <tr>
                              <td><b>Date and Time:</b></td>
                              <td> ${date} ${time}</td>
                            </tr>
                            <tr>
                              <td><b>Counselor:</b></td>
                              <td>${counsellor}</td>
                            </tr>
                            <tr>
                              <td><b>Session Type:</b></td>
                              <td>${sessiontype}</td>
                            </tr>
                            <tr>
                              <td><b>Duration:</b></td>
                              <td>${duration}</td>
                            </tr>
                            <tr>
                              <td><b>Payment Total:</b></td>
                              <td>${payment}</td>
                            </tr>
                          </table>
                          <br><br>
                          Please take note of the following: <br><br>
                          <ul style="list-style-type: none; margin: 0; padding: 0; font-size: 2vh; font-family: Georgia; color: black;">
                            <li>Ensure that you are in a quiet and comfortable space for your session.</li>
                            <li>If this is a virtual session, click the provided meeting link at the scheduled time.</li>
                            <li>If this is an in-person session, please arrive at the counseling center [Address] 10 minutes before your scheduled time.</li>
                          </ul>
                          <br>
                          Should you need to reschedule or cancel your session, please do so at least 24 hours in advance to avoid any cancellation fees. <br><br>
                          If you have any questions or require further assistance, feel free to contact us at [Customer Support Email or Phone Number]. <br><br>
                          We're here to support you on your journey to well-being. Thank you for choosing our counseling service. <br><br>
                          Best regards, <br />
                          The
                          <a href="https://sortmycollege.com/" style="color: #1f0a68; font-weight: 700; text-decoration: none;">SortMyCollege</a>
                          Team
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    
    `,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        res.status(500).send("Error sending email");
      } else {
        console.log("Email sent:", info.response);
        res.send("Email sent successfully");
      }
    });
    console.log("running");
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

exports.bookedSessionCounsellorEmailNotification = (req, res) => {
  try {
    const {
      to,
      date,
      time,
      client,
      sessiontype,
      duration,
      location,
      payment,
      subject,
      username,
      session_topic,
      link,
    } = req.body;
    function formatTime(minutes) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      const period = hours >= 12 ? "PM" : "AM";
      const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format
      const formattedMinutes = mins < 10 ? "0" + mins : mins; // Pad minutes with zero if needed
      return `${formattedHours}:${formattedMinutes} ${period}`;
    }
    const formattedDate = new Date(date).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    console.log(req.body);
    const mailOptions = {
      date,
      time,
      client,
      sessiontype,
      duration,
      location,
      payment,
      link,
      session_topic,
      to,
      subject,
      html: `<body>
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
        <tr>
          <td style="box-sizing: border-box; padding: 25px; margin: 10px;">
            <table width="100%" border="1" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
              <tr>
                <td align="center" bgcolor="#ffffff">
                  <table width="400" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
                    <tr>
                      <td align="center">
                        <a href="https://sortmycollege.com/">
                          <img src="https://sortmycollege.com/wp-content/uploads/2023/10/cropped-SORTMYCOLLEGE-12-1.png" alt="" width="400" height="100" style="display: block;">
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td align="center">
                        <h1 style="font-family: Georgia, 'Times New Roman', Times, serif; font-size: 3vh; color: black;">
                          Welcome to
                          <a href="https://sortmycollege.com/" style="color: #1f0a68; font-weight: 700; text-decoration: none;">SortMyCollege</a>
                        </h1>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <p style="font-size: 2vh; font-family: Georgia, 'Times New Roman', Times, serif; color: black;">
                          To <br/> ${username},<br><br>
                          We are delighted to inform you that a new counselling session has been booked through our platform. Below are the details of the booking: <br><br>
                          <table border="0" cellspacing="0" cellpadding="0" style="font-size: 2vh; font-family: Georgia, 'Times New Roman', Times, serif; color: black;">
                            <tr>
                              <td><b>Client Name:</b></td>
                              <td>${client}</td>
                            </tr>
                            <tr>
                              <td><b>Date and Time:</b></td>
                              <td>${formattedDate} ${formatTime(time)}</td>
                            </tr>
                            <tr>
                              <td><b>Session Type:</b></td>
                              <td>${sessiontype}</td>
                            </tr>
                            <tr>
                              <td><b>Session Topic:</b></td>
                              <td>${
                                sessiontype === "Group"
                                  ? session_topic
                                  : "Personal session"
                              }</td>
                            </tr>
                            <tr>
                              <td><b>Duration:</b></td>
                              <td>${duration}</td>
                            </tr>
                            <tr>
                              <td><b>Payment:</b></td>
                              <td>${payment}</td>
                            </tr>
                            <tr>
                              <td><b>Meeting Link:</b></td>
                              <td><a href=${link}>Link</a></td>
                            </tr>
                          </table>
                          <br><br>
                          <p style="font-size: 2vh; font-family: Georgia, 'Times New Roman', Times, serif; color: black;">
                          Please ensure that you are available and prepared for the scheduled session. If you have any inquiries or require additional information regarding this booking, please do not hesitate to contact us at support@sortmycollege.com. <br><br>
                          We greatly appreciate your dedication to providing counselling services. Your expertise and support are invaluable.<br><br>
                          Best regards </p> <br />
                          <a href="https://sortmycollege.com/" style="color: #1f0a68; font-weight: 700; text-decoration: none;">SortMyCollege</a>
                          
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        res.status(500).send("Error sending email");
      } else {
        console.log("Email sent:", info.response);
        res.send("Email sent successfully");
      }
    });
    console.log("running");
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

exports.reminderSessionCounsellorEmailNotification = (req, res) => {
  try {
    const { to, date, time, client, subject, username } = req.body;
    console.log(req.body);
    const mailOptions = {
      date,
      time,
      client,
      to,
      subject,
      html: `<body>
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
        <tr>
          <td style="box-sizing: border-box; padding: 25px; margin: 10px;">
            <table width="100%" border="1" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
              <tr>
                <td align="center" bgcolor="#ffffff">
                  <table width="400" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
                    <tr>
                      <td align="center">
                        <a href="https://sortmycollege.com/">
                          <img src="https://sortmycollege.com/wp-content/uploads/2023/05/SORTMYCOLLEGE-12.png" alt="" width="400" height="100" style="display: block;">
                        </a>
                      </td>
                    </tr>
                    
                    <tr>
                      <td>
                        <p style="font-size: 2vh; font-family: Georgia; color: black;">
                          Hello ${username} <br><br>
                          This is a reminder for an upcoming counseling session with ${client}
                           on ${date} at ${time}. The session will be conducted via
                           <a href="https://sortmycollege.com/" style="color: #1f0a68; font-weight: 700; text-decoration: none;">SortMyCollege</a><br><br>
                          <table border="0" cellspacing="0" cellpadding="0" style="font-size: 2vh; font-family: Georgia; color: black;">                            
                          </table>
                          <br><br>
                          
                          Please ensure that you are available and prepared for the scheduled session. If you have any questions or need further information about this booking, please do not hesitate to contact us <br><br>
                          Thank you for your commitment to providing counseling services through our platform. We appreciate your dedication to helping individuals in need
                          <br /><br />Best regards, <br />
                          The
                          <a href="https://sortmycollege.com/" style="color: #1f0a68; font-weight: 700; text-decoration: none;">SortMyCollege</a>
                          Team
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    
    `,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        res.status(500).send("Error sending email");
      } else {
        console.log("Email sent:", info.response);
        res.send("Email sent successfully");
      }
    });
    console.log("running");
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

exports.reminderSessionUserEmailNotification = (req, res) => {
  try {
    const { to, date, time, counsellor, subject, username } = req.body;
    console.log(req.body);
    const mailOptions = {
      date,
      time,
      counsellor,
      to,
      subject,
      html: `<body>
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
        <tr>
          <td style="box-sizing: border-box; padding: 25px; margin: 10px;">
            <table width="100%" border="1" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
              <tr>
                <td align="center" bgcolor="#ffffff">
                  <table width="400" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
                    <tr>
                      <td align="center">
                        <a href="https://sortmycollege.com/">
                          <img src="https://sortmycollege.com/wp-content/uploads/2023/05/SORTMYCOLLEGE-12.png" alt="" width="400" height="100" style="display: block;">
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td align="center">
                        
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <p style="font-size: 2vh; font-family: Georgia; color: black;">
                          Hello ${username} <br><br>
                          We're looking forward to your upcoming counseling session with us! Here are the details of your session: <br><br>
                          <table border="0" cellspacing="0" cellpadding="0" style="font-size: 2vh; font-family: Georgia; color: black;">
                            <tr>
                              <td><b>Date and Time:</b></td>
                              <td> ${date} ${time}</td>
                            </tr>
                            <tr>
                              <td><b>Counsellor Name:</b></td>
                              <td>${counsellor}</td>
                            </tr>
                            
                          </table>
                          <br><br>
                          
                          Please make sure you're prepared and in a quiet, comfortable space for your session. If you have any specific topics or concerns you'd like to discuss during the session, feel free to jot them down so you can get the most out of your time with the counselor. <br><br>
                          Best regards, <br />
                          The
                          <a href="https://sortmycollege.com/" style="color: #1f0a68; font-weight: 700; text-decoration: none;">SortMyCollege</a>
                          Team
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    
    `,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        res.status(500).send("Error sending email");
      } else {
        console.log("Email sent:", info.response);
        res.send("Email sent successfully");
      }
    });
    console.log("running");
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

exports.attendedSessionUserEmailNotification = (req, res) => {
  try {
    const { to, subject, username } = req.body;
    console.log(req.body);
    const mailOptions = {
      to,
      subject,
      html: `<body>
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
        <tr>
          <td style="box-sizing: border-box; padding: 25px; margin: 10px;">
            <table width="100%" border="1" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
              <tr>
                <td align="center" bgcolor="#ffffff">
                  <table width="400" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
                    <tr>
                      <td align="center">
                        <a href="https://sortmycollege.com/">
                          <img src="https://sortmycollege.com/wp-content/uploads/2023/05/SORTMYCOLLEGE-12.png" alt="" width="400" height="100" style="display: block;">
                        </a>
                      </td>
                    </tr>
                    
                    <tr>
                      <td>
                        <p style="font-size: 2vh; font-family: Georgia; color: black;">
                          Hello ${username} <br><br>
                          "Thank you for choosing <a href="https://sortmycollege.com/" style="color: #1f0a68; font-weight: 700; text-decoration: none;">SortMyCollege</a> for your 
                          counseling needs. We're grateful that you've entrusted us to be a
                           part of your journey towards personal growth and well-being.  <br><br>
                          
                          <br><br>
                          
                          Our team of experienced and compassionate counselors is here to assist you every step of the way. If you have any questions or need any assistance before your session, please don't hesitate to reach out to our customer support team at [Customer Support Email or Phone Number]. <br><br>
                          Best regards, <br />
                          The
                          <a href="https://sortmycollege.com/" style="color: #1f0a68; font-weight: 700; text-decoration: none;">SortMyCollege</a>
                          Team
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    
    `,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        res.status(500).send("Error sending email");
      } else {
        console.log("Email sent:", info.response);
        res.send("Email sent successfully");
      }
    });
    console.log("running");
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

exports.attendedSessionCounsellorEmailNotification = (req, res) => {
  try {
    const { to, subject, username } = req.body;
    console.log(req.body);
    const mailOptions = {
      to,
      subject,
      html: `<body>
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
        <tr>
          <td style="box-sizing: border-box; padding: 25px; margin: 10px;">
            <table width="100%" border="1" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
              <tr>
                <td align="center" bgcolor="#ffffff">
                  <table width="400" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
                    <tr>
                      <td align="center">
                        <a href="https://sortmycollege.com/">
                          <img src="https://sortmycollege.com/wp-content/uploads/2023/05/SORTMYCOLLEGE-12.png" alt="" width="400" height="100" style="display: block;">
                        </a>
                      </td>
                    </tr>
                    
                    <tr>
                      <td>
                        <p style="font-size: 2vh; font-family: Georgia; color: black;">
                          Hello ${username} <br><br>
                          I wanted to take a moment to express my gratitude for the insightful and supportive counseling session today. Your guidance and expertise have been invaluable to us, and I truly appreciate your dedication to helping us work through our challenges. <br><br>
                        
                          
                          Thank you for being a source of guidance and support during this time. I look forward to our next session and continuing this journey of self-discovery and growth with your help.<br><br>
                          Best regards, <br />
                          The
                          <a href="https://sortmycollege.com/" style="color: #1f0a68; font-weight: 700; text-decoration: none;">SortMyCollege</a>
                          Team
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    
    `,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        res.status(500).send("Error sending email");
      } else {
        console.log("Email sent:", info.response);
        res.send("Email sent successfully");
      }
    });
    console.log("running");
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

exports.notattendedSessionCounsellorEmailNotification = (req, res) => {
  try {
    const { to, subject, username, client, date, time } = req.body;
    console.log(req.body);
    const mailOptions = {
      to,
      client,
      date,
      time,
      subject,
      html: `<body>
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
        <tr>
          <td style="box-sizing: border-box; padding: 25px; margin: 10px;">
            <table width="100%" border="1" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
              <tr>
                <td align="center" bgcolor="#ffffff">
                  <table width="400" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
                    <tr>
                      <td align="center">
                        <a href="https://sortmycollege.com/">
                          <img src="https://sortmycollege.com/wp-content/uploads/2023/05/SORTMYCOLLEGE-12.png" alt="" width="400" height="100" style="display: block;">
                        </a>
                      </td>
                    </tr>
                    
                    <tr>
                      <td>
                        <p style="font-size: 2vh; font-family: Georgia; color: black;">
                          Hello ${username} <br><br>
                          I hope this message finds you well. I regret to inform you that the client scheduled for a counseling session on ${date} and ${time},
                           did not attend the session as expected. <br><br>

Here are the details of the session: <br>

Client's Name: ${client}<br><br>
Despite multiple reminders and confirmations sent to the client via email and SMS, they failed to show up for their scheduled appointment. We understand that unforeseen circumstances can sometimes lead to missed sessions, and we have attempted to reach out to the client to reschedule or understand their situation better.

We kindly request that you review your schedule to determine if any rescheduling is necessary, and if you have 
any specific instructions or preferences for handling such situations, please let us know. If you would like
 us to follow up with the client on your behalf or make any changes to your availability, please inform us accordingly.<br><br>
                        
                          
                          Best regards, <br />
                          The
                          <a href="https://sortmycollege.com/" style="color: #1f0a68; font-weight: 700; text-decoration: none;">SortMyCollege</a>
                          Team
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    
    `,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        res.status(500).send("Error sending email");
      } else {
        console.log("Email sent:", info.response);
        res.send("Email sent successfully");
      }
    });
    console.log("running");
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

exports.notattendedSessionUserEmailNotification = (req, res) => {
  try {
    const { to, date, time, subject, username } = req.body;
    console.log(req.body);
    const mailOptions = {
      to,
      subject,
      date,
      time,
      html: `<body>
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
        <tr>
          <td style="box-sizing: border-box; padding: 25px; margin: 10px;">
            <table width="100%" border="1" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
              <tr>
                <td align="center" bgcolor="#ffffff">
                  <table width="400" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
                    <tr>
                      <td align="center">
                        <a href="https://sortmycollege.com/">
                          <img src="https://sortmycollege.com/wp-content/uploads/2023/05/SORTMYCOLLEGE-12.png" alt="" width="400" height="100" style="display: block;">
                        </a>
                      </td>
                    </tr>
                    
                    <tr>
                      <td>
                        <p style="font-size: 2vh; font-family: Georgia; color: black;">
                          Hello ${username} <br><br>
                          We hope this message finds you well. We understand that life can 
                          sometimes throw unexpected challenges our way, and we want to acknowledge 
                          that you were unable to attend your scheduled counseling session on ${date} and ${time}. <br><br>
                          
                          <br><br>
                          
                          Thank you for considering our counseling service, and we look forward to assisting you in your journey to emotional well-being.<br><br>
                          Best regards, <br />
                          The
                          <a href="https://sortmycollege.com/" style="color: #1f0a68; font-weight: 700; text-decoration: none;">SortMyCollege</a>
                          Team
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    
    `,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        res.status(500).send("Error sending email");
      } else {
        console.log("Email sent:", info.response);
        res.send("Email sent successfully");
      }
    });
    console.log("running");
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

exports.cancelledSessionUserEmailNotification = (req, res) => {
  try {
    const { to, date, time, subject, username, counsellor } = req.body;
    console.log(req.body);
    const mailOptions = {
      to,
      subject,
      date,
      counsellor,
      time,
      html: `<body>
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
        <tr>
          <td style="box-sizing: border-box; padding: 25px; margin: 10px;">
            <table width="100%" border="1" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
              <tr>
                <td align="center" bgcolor="#ffffff">
                  <table width="400" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
                    <tr>
                      <td align="center">
                        <a href="https://sortmycollege.com/">
                          <img src="https://sortmycollege.com/wp-content/uploads/2023/05/SORTMYCOLLEGE-12.png" alt="" width="400" height="100" style="display: block;">
                        </a>
                      </td>
                    </tr>
                    
                    <tr>
                      <td>
                        <p style="font-size: 2vh; font-family: Georgia; color: black;">
                          Hello ${username} <br><br>
                          We hope this message finds you well. We hope this message finds 
                          you well. We regret to inform you that your upcoming
                           counseling session scheduled for ${date} and ${time} with ${counsellor} has been cancelled. <br><br>

                          
                          <br><br>
                          
                          Thank you for considering our counseling service, and we look forward to assisting you in your journey to emotional well-being.<br><br>
                          Best regards, <br />
                          The
                          <a href="https://sortmycollege.com/" style="color: #1f0a68; font-weight: 700; text-decoration: none;">SortMyCollege</a>
                          Team
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    
    `,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        res.status(500).send("Error sending email");
      } else {
        console.log("Email sent:", info.response);
        res.send("Email sent successfully");
      }
    });
    console.log("running");
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

exports.cancelledSessionCounsellorEmailNotification = (req, res) => {
  try {
    const { to, date, time, subject, username, client } = req.body;
    console.log(req.body);
    const mailOptions = {
      to,
      subject,
      date,
      client,
      time,
      html: `<body>
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
        <tr>
          <td style="box-sizing: border-box; padding: 25px; margin: 10px;">
            <table width="100%" border="1" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
              <tr>
                <td align="center" bgcolor="#ffffff">
                  <table width="400" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
                    <tr>
                      <td align="center">
                        <a href="https://sortmycollege.com/">
                          <img src="https://sortmycollege.com/wp-content/uploads/2023/05/SORTMYCOLLEGE-12.png" alt="" width="400" height="100" style="display: block;">
                        </a>
                      </td>
                    </tr>                    
                    <tr>
                      <td>
                        <p style="font-size: 2vh; font-family: Georgia; color: black;">
                          Hello ${username} <br><br>
                          We hope this message finds you well. We hope this message finds 
                          you well. We regret to inform you that your upcoming
                           counseling session scheduled for ${date} and ${time} with ${client} has been cancelled. <br><br>
                          <br><br>                          
                          Thank you for your continued commitment to our counseling service.<br><br>
                          Best regards, <br />
                          The
                          <a href="https://sortmycollege.com/" style="color: #1f0a68; font-weight: 700; text-decoration: none;">SortMyCollege</a>
                          Team
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>    
    `,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        res.status(500).send("Error sending email");
      } else {
        console.log("Email sent:", info.response);
        res.send("Email sent successfully");
      }
    });
    console.log("running");
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

exports.gotreviewSessionCounsellorEmailNotification = (req, res) => {
  try {
    const { to, date, time, subject, username, client } = req.body;
    console.log(req.body);
    const mailOptions = {
      to,
      subject,
      date,
      client,
      time,
      html: `<body>
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
        <tr>
          <td style="box-sizing: border-box; padding: 25px; margin: 10px;">
            <table width="100%" border="1" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
              <tr>
                <td align="center" bgcolor="#ffffff">
                  <table width="400" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
                    <tr>
                      <td align="center">
                        <a href="https://sortmycollege.com/">
                          <img src="https://sortmycollege.com/wp-content/uploads/2023/05/SORTMYCOLLEGE-12.png" alt="" width="400" height="100" style="display: block;">
                        </a>
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <p style="font-size: 2vh; font-family: Georgia; color: black;">
                          Hello ${username} <br><br>
                          We hope this message finds you well. We sent this mail to inform you that your
                           counseling session whiich is scheduled for ${date} and ${time} with ${client} has been 
                           got a review. <br><br>
                          <br><br>
                          You can see it on  <a href="https://sortmycollege.com/" style="color: #1f0a68; font-weight: 700; text-decoration: none;">SortMyCollege</a>
                          portal.<br><br>
                          Best regards, <br />
                          The
                          <a href="https://sortmycollege.com/" style="color: #1f0a68; font-weight: 700; text-decoration: none;">SortMyCollege</a>
                          Team
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>    
    `,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        res.status(500).send("Error sending email");
      } else {
        console.log("Email sent:", info.response);
        res.send("Email sent successfully");
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

exports.verifyCounsellorEmailNotification = async (req, res) => {
  try {
    const { to, username } = req.body;
    console.log(to, username);
    const mailOptions = {
      to,
      subject: "SortMyCollege Counsellor Verification Approved",
      html: `<body>
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
        <tr>
          <td style="box-sizing: border-box; padding: 25px; margin: 10px;">
            <table width="100%" border="1" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
              <tr>
                <td align="center" bgcolor="#ffffff">
                  <table width="400" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
                    <tr>
                      <td align="center">
                        <a href="https://sortmycollege.com/">
                          <img src="https://sortmycollege.com/wp-content/uploads/2023/10/cropped-SORTMYCOLLEGE-12-1.png" alt="" width="400" height="100" style="display: block;">
                        </a>
                      </td>
                    </tr>
                    
                    <tr>
                      <td>
                        <p style="font-size: 2vh; font-family: Georgia; color: black;">
                          To,<br>
                           ${username} <br><br>
                           We hope this email finds you well.                                    
                          <br><br>                          
                          We are pleased to inform you that your verification request has been approved. You now have access to the <a href="https://counsellor.sortmycollegeapp.com/" style="color: #1f0a68; font-weight: 700; text-decoration: none;">Counsellor Portal</a>
                          and can start launching sessions and connecting with students seeking career guidance.<br> <br>
                          If you have any questions or need further assistance, please feel free to email us at support@sortmycollege.com. <br><br>
                          Best regards, <br />
                          
                          <a href="https://sortmycollege.com/" style="color: #1f0a68; font-weight: 700; text-decoration: none;">SortMyCollege</a>
                          Team
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>    
    `,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        res.status(500).send("Error sending email");
      } else {
        console.log("Email sent:", info.response);
        res.send("Email sent successfully");
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.rejectCounsellorEmailNotification = async (req, res) => {
  try {
    const { to, reason, username } = req.body;
    console.log(to, reason, username);
    const mailOptions = {
      to,
      subject: "SortMyCollege Counsellor Verification Rejected",
      html: `<body>
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
        <tr>
          <td style="box-sizing: border-box; padding: 25px; margin: 10px;">
            <table width="100%" border="1" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
              <tr>
                <td align="center" bgcolor="#ffffff">
                  <table width="400" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
                    <tr>
                      <td align="center">
                        <a href="https://sortmycollege.com/">
                          <img src="https://sortmycollege.com/wp-content/uploads/2023/10/cropped-SORTMYCOLLEGE-12-1.png" alt="" width="400" height="100" style="display: block;">
                        </a>
                      </td>
                    </tr>
                    
                    <tr>
                      <td>
                        <p style="font-size: 2vh; font-family: Georgia; color: black;">
                          To,<br>
                           ${username} <br><br>
                           We hope this email finds you well. <br>
                           We regret to inform you that your verification request has been rejected.<br><br> 
                          <b>Reason </b>: ${reason}               
                          <br><br>                          
                          Please log in to the <a href="https://counsellor.sortmycollegeapp.com/" style="color: #1f0a68; font-weight: 700; text-decoration: none;">Counsellor Portal</a>
                          to review the details and make the necessary updates to your profile. We encourage you to complete all required sections to facilitate a smooth verification process.<br> <br>
                          If you have any questions or need further assistance, please feel free to email us at support@sortmycollege.com. <br><br>
                          Best regards, <br />
                          
                          <a href="https://sortmycollege.com/" style="color: #1f0a68; font-weight: 700; text-decoration: none;">SortMyCollege</a>
                          Team
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>    
    `,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        res.status(500).send("Error sending email");
      } else {
        console.log("Email sent:", info.response);
        res.send("Email sent successfully");
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.verifyInstituteEmailNotification = async (req, res) => {
  try {
    const { to, username } = req.body;
    console.log(to, username);
    const mailOptions = {
      to,
      subject: "SortMyCollege Institute Verification Request Approved",
      html: `<body>
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
        <tr>
          <td style="box-sizing: border-box; padding: 25px; margin: 10px;">
            <table width="100%" border="1" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
              <tr>
                <td align="center" bgcolor="#ffffff">
                  <table width="400" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
                    <tr>
                      <td align="center">
                        <a href="https://sortmycollege.com/">
                          <img src="https://sortmycollege.com/wp-content/uploads/2023/10/cropped-SORTMYCOLLEGE-12-1.png" alt="" width="400" height="100" style="display: block;">
                        </a>
                      </td>
                    </tr>
                    
                    <tr>
                      <td>
                        // <p style="font-size: 2vh; font-family: Georgia; color: black;">
                        //   To,<br>
                        //    ${username} <br><br>
                        //    We hope this email finds you well.                                    
                        //   <br><br>                          
                        //   We are pleased to inform you that your verification request has been approved. You now have access to the <a href="https://ep.sortmycollegeapp.com/" style="color: #1f0a68; font-weight: 700; text-decoration: none;">Entrance Preparation Portal</a>
                        //   and can start adding courses and connecting with students seeking career guidance.<br> <br>
                        //   If you have any questions or need further assistance, please feel free to email us at support@sortmycollege.com. <br><br>
                        //   Best regards, <br />
                          
                        //   <a href="https://sortmycollege.com/" style="color: #1f0a68; font-weight: 700; text-decoration: none;">SortMyCollege</a>
                        //   Team
                        // </p>
                        <p style="font-size: 2vh; font-family: Georgia; color: black;">
                          To,<br>
                          ${username} <br><br>
                          We hope this email finds you well.<br><br>
                          We are pleased to inform you that your profile verification request has been approved.<br><br>
                          You now have access to the <a href="https://your-institute-dashboard-link.com" style="color: #1f0a68; font-weight: 700; text-decoration: none;">Institute Dashboard</a>, and you can start updating courses offered, faculties, key features, and the announcement section.<br><br>
                          If you have any questions or need further assistance, please feel free to email us at <a href="mailto:support@sortmycollege.com" style="color: #1f0a68; font-weight: 700; text-decoration: none;">support@sortmycollege.com</a>.<br><br>
                          Best regards,<br />
                          <a href="https://sortmycollege.com/" style="color: #1f0a68; font-weight: 700; text-decoration: none;">SortMyCollege</a><br />
                          Team
                      </p>
                      
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>    
    `,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        res.status(500).send("Error sending email");
      } else {
        console.log("Email sent:", info.response);
        res.send("Email sent successfully");
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.rejectInstituteEmailNotification = async (req, res) => {
  try {
    const { to, reason, username } = req.body;
    console.log(to, reason, username);
    const mailOptions = {
      to,
      subject: "SortMyCollege Institute Verification Request Rejected",
      html: `<body>
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
        <tr>
          <td style="box-sizing: border-box; padding: 25px; margin: 10px;">
            <table width="100%" border="1" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
              <tr>
                <td align="center" bgcolor="#ffffff">
                  <table width="400" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
                    <tr>
                      <td align="center">
                        <a href="https://sortmycollege.com/">
                          <img src="https://sortmycollege.com/wp-content/uploads/2023/10/cropped-SORTMYCOLLEGE-12-1.png" alt="" width="400" height="100" style="display: block;">
                        </a>
                      </td>
                    </tr>
                    
                    <tr>
                      <td>
                        // <p style="font-size: 2vh; font-family: Georgia; color: black;">
                        //   To,<br>
                        //    ${username} <br><br>
                        //    We hope this email finds you well. <br>
                        //    We regret to inform you that your verification request has been rejected.<br><br> 
                        //   <b>Reason </b>: ${reason}               
                        //   <br><br>                          
                        //   Please log in to the <a href="https://ep.sortmycollegeapp.com/" style="color: #1f0a68; font-weight: 700; text-decoration: none;">Entrance Preparation Portal</a>
                        //   to review the details and make the necessary updates to your profile. We encourage you to complete all required sections to facilitate a smooth verification process.<br> <br>
                        //   If you have any questions or need further assistance, please feel free to email us at support@sortmycollege.com. <br><br>
                        //   Best Regards, <br />
                          
                        //   <a href="https://sortmycollege.com/" style="color: #1f0a68; font-weight: 700; text-decoration: none;">SortMyCollege</a>
                        //   Team
                        // </p>
                        <p style="font-size: 2vh; font-family: Georgia; color: black;">
                            To,<br>
                            ${username} <br><br>
                            We hope this email finds you well.<br><br>
                            We regret to inform you that your profile verification request has been rejected.<br><br>
                            Reason: ${reason}<br><br>
                            Kindly log in to the <a href="https://your-institute-dashboard-link.com" style="color: #1f0a68; font-weight: 700; text-decoration: none;">Institute Dashboard</a> to review the details and make the necessary updates to your profile. We encourage you to complete all required sections to facilitate a smooth verification process.<br><br>
                            If you have any questions or need further assistance, please feel free to email us at <a href="mailto:support@sortmycollege.com" style="color: #1f0a68; font-weight: 700; text-decoration: none;">support@sortmycollege.com</a>.<br><br>
                            Best regards,<br />
                            <a href="https://sortmycollege.com/" style="color: #1f0a68; font-weight: 700; text-decoration: none;">SortMyCollege</a><br />
                            Team
                        </p>

                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>    
    `,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        res.status(500).send("Error sending email");
      } else {
        console.log("Email sent:", info.response);
        res.send("Email sent successfully");
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};



exports.generatedHelpNotification = (req, res) => {
  try {
    // Validate the request parameters
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { to } = req.body;

    const mailOptions = {
      to,
      subject: "Raised a query",
      html: `
      <body>
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td align="center" bgcolor="#ffffff">
              <table border="0" cellpadding="0" cellspacing="0" width="600">
                <!-- Header Section -->
                <tr>
                  <td align="center" valign="top">
                    <a href="https://sortmycollege.com/">
                      <img
                        src="https://sortmycollege.com/wp-content/uploads/2023/05/SORTMYCOLLEGE-12.png"
                        alt=""
                        width="200"
                        height="50"
                      />
                    </a>
                  </td>
                </tr>
  
                <!-- Content Section -->
                <tr>
                  <td align="center">
                    <h1
                      style="
                        font-family: 'Arial', 'Helvetica', sans-serif;
                        font-size: 24px;
                        color: #1f0a68;
                      "
                    >
                      Welcome to
                      <a
                        href="https://sortmycollege.com/"
                        style="
                          color: #1f0a68;
                          font-weight: 700;
                          text-decoration: none;
                        "
                      >
                        SortMyCollege
                      </a>
                    </h1>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p
                      style="
                        font-family: 'Arial', 'Helvetica', sans-serif;
                        font-size: 16px;
                        color: #333;
                      "
                    >
                  ADMIN,<br /><br />
                      <!-- You can insert the OTP dynamically here -->
                      <b>${to}</b><br /><br />
                      raised a query
                      <a
                        href="https://sortmycollege.com/"
                        style="
                          color: #1f0a68;
                          font-weight: 700;
                          text-decoration: none;
                        "
                      >
                        SortMyCollege
                      </a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ error: "Error sending email" });
      } else {
        console.log("Email sent:", info.response);
        res.json({ message: "Email sent successfully" });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
