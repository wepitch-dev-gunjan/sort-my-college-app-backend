const fs = require("fs");
const { transporter } = require("../services/emailService");

const welcomeEmailTemplate = fs.readFileSync(
  "emailFormats/user_welcome.html",
  "utf-8"
);

exports.welcomeUserEmailNotification = (req, res) => {
  try {
    const { from, to, subject, username } = req.body;
    console.log(req.body);
    const mailOptions = {
      from,
      to,
      subject,
      html: `<body>
      <style>
        body {
          box-sizing: border-box;
        }
        .content {
          border: 1px solid black;
  
          padding: 25px;
          margin: 10px;
        }
  
        .content h1 {
          text-align: center;
          font-size: 3vh;
          color: black;
          font-family: Georgia, "Times New Roman", Times, serif;
        }
        a img {
          max-width: 100%;
          height: auto;
          height: 50px;
          width: 200px;
        }
        
      </style>
      <div class="container">
        <div class="content">
          <a href="https://sortmycollege.com/"
          style="display: flex; justify-content: center; align-items: center"
            ><img
              src="https://sortmycollege.com/wp-content/uploads/2023/05/SORTMYCOLLEGE-12.png"
              alt=""
          /></a>
  
          <br />
          <h1 style="text-align: center; color: black">
            Welcome to
            <a
              href="https://sortmycollege.com/"
              style="color: #1f0a68; font-weight: 700; text-decoration: none"
              >SortMyCollege</a
            >
          </h1>
          <br />
          <p
            style="font-size: 2.5vh; font-family: Georgia; color: black"
            Times
            New
            Roman,
            Times,
            serif;
          >
            Dear ${username}, <br /><br />
            We're delighted to have you join our community of individuals seeking
            support, guidance, and personal growth. At
            <a
              href="https://sortmycollege.com/"
              style="color: #1f0a68; font-weight: 700; text-decoration: none"
            >
              SortMyCollege</a
            >, we understand that life can present its challenges, and taking the
            step to seek counseling is a powerful one. <br /><br />
            Our dedicated team of experienced counselors are here to provide you
            with a safe and confidential space where you can explore your
            thoughts, feelings, and concerns. Whether you're looking for help with
            managing stress, improving relationships, coping with life
            transitions, or working on personal development, we're here to support
            you every step of the way.
            <br /><br />
            Feel free to explore our platform, browse our counselor profiles, and
            schedule your first appointment when you're ready to begin your
            counseling journey. Remember, seeking help is a sign of strength, and
            you are not alone in this journey. <br /><br />
            If you have any questions or need assistance, our support team is here
            to help. Once again, welcome to
            <a
              href="https://sortmycollege.com/"
              style="color: #1f0a68; font-weight: 700; text-decoration: none"
              >SortMyCollege</a
            >, where your well-being is our priority. <br /><br />
            We look forward to supporting you on your path to a happier and
            healthier life. <br /><br />
            Best regards, <br />
            The
            <a
              href="https://sortmycollege.com/"
              style="color: #1f0a68; font-weight: 700; text-decoration: none"
              >SortMyCollege</a
            >
            Team
          </p>
        </div>
      </div>
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
