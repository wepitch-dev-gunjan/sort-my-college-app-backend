const fs = require("fs");
const { transporter } = require("../services/emailService");

const welcomeEmailTemplate = fs.readFileSync(
  "emailFormats/user_welcome.html",
  "utf-8"
);

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
    console.log("running");
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

exports.bookedSessionUserEmailNotification = (req, res) => {
  try {
    const {
      to,
      date,
      time,
      counsellor,
      sessiontype,
      duration,
      location,
      payment,
      subject,
      username,
    } = req.body;
    console.log(req.body);
    const mailOptions = {
      date,
      time,
      counsellor,
      sessiontype,
      duration,
      location,
      payment,
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
                              <td><b>Location:</b></td>
                              <td>${location}</td>
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
    } = req.body;
    console.log(req.body);
    const mailOptions = {
      date,
      time,
      client,
      sessiontype,
      duration,
      location,
      payment,
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
                          We are pleased to inform you that a new counseling session has been booked on our platform. Please find the details of the booking below: <br><br>
                          <table border="0" cellspacing="0" cellpadding="0" style="font-size: 2vh; font-family: Georgia; color: black;">
                            <tr>
                              <td><b>Date and Time:</b></td>
                              <td> ${date} ${time}</td>
                            </tr>
                            <tr>
                              <td><b>Client Name:</b></td>
                              <td>${client}</td>
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
                              <td><b>Location:</b></td>
                              <td>${location}</td>
                            </tr>
                            <tr>
                              <td><b>Payment Total:</b></td>
                              <td>${payment}</td>
                            </tr>
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
    console.log("running");
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};
