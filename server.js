const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const xlsx = require('xlsx');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files like index.html

// POST route to handle form submission
app.post('/submit', async (req, res) => {
    const { name, email, message } = req.body;

    // Save data to Excel
    const filePath = './data.xlsx';
    let workbook;
    let worksheet;

    if (fs.existsSync(filePath)) {
        workbook = xlsx.readFile(filePath);
        worksheet = workbook.Sheets['Messages'];
    } else {
        workbook = xlsx.utils.book_new();
        worksheet = xlsx.utils.aoa_to_sheet([['Name', 'Email', 'Message']]);
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Messages');
    }

    const newRow = [name, email, message];
    const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
    data.push(newRow);
    const updatedSheet = xlsx.utils.aoa_to_sheet(data);
    workbook.Sheets['Messages'] = updatedSheet;

    xlsx.writeFile(workbook, filePath);

    // Send email
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'your-email@gmail.com', // Replace with your email
                pass: 'your-email-password', // Replace with your email password or app password
            },
        });

        const mailOptions = {
            from: 'your-email@gmail.com',
            to: 'milansahoo2005721166@gmail.com',
            subject: 'New Contact Form Submission',
            text: `You have received a new message:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`,
        };

        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully.');

        res.status(200).send('Data saved and email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Error saving data or sending email');
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
