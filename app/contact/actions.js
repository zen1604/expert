// app/contact/actions.js
'use server';

// This function will be called by our form
export async function sendContactMessage(previousState, formData) {
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');

    // Basic validation
    if (!name || !email || !subject || !message) {
        return { success: false, message: 'Please fill out all fields.' };
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    // We format the message using Markdown for a nice look in Telegram
    const text = `
*New Contact Form Submission*

*Name:* ${name}
*Email:* ${email}
*Subject:* ${subject}

*Message:*
${message}
    `;

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: text,
                parse_mode: 'Markdown', // This tells Telegram to render the asterisks as bold text
            }),
        });

        const result = await response.json();

        if (!result.ok) {
            // If Telegram's API reports an error
            console.error('Telegram API Error:', result);
            return { success: false, message: 'Something went wrong. Please try again later.' };
        }

        // It worked!
        return { success: true, message: 'Thank you for your message! We will get back to you shortly.' };

    } catch (error) {
        console.error('Fetch Error:', error);
        return { success: false, message: 'Could not connect to the server. Please try again later.' };
    }
}
