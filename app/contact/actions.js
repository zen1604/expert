// app/contact/actions.js
'use server';

export async function sendContactMessage(previousState, formData) {
    // 1. Get form data
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const subject = formData.get('subject');
    const message = formData.get('message');

    // 2. Basic validation (removed 'type')
    if (!name || !email || !phone || !subject || !message) {
        return { success: false, message: 'Please fill out all fields.' };
    }

    // 3. Get environment variables
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    const crmWebhookUrl = process.env.CRM_WEBHOOK_URL;

    // 4. Send to Telegram
    try {
        const telegramText = `
*New Contact Form Submission*

*Name:* ${name}
*Email:* ${email}
*Phone:* ${phone}
*Subject:* ${subject}

*Message:*
${message}
        `;
        const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
        await fetch(telegramUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: telegramText,
                parse_mode: 'Markdown',
            }),
        });
    } catch (error) {
        console.error('Failed to send Telegram message:', error);
        // Continue even if Telegram fails
    }

    // 5. Send to CRM with detailed error logging
    try {
        const crmData = {
            name: name,
            phone: phone,
            email: email,
            comment: `Subject: ${subject}\n\n${message}`,
            source: 'Website Contact Form',
            status: 1, // 1: lead
            lang: 'e',
            noty: 1,
        };

        const crmResponse = await fetch(crmWebhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(crmData),
        });

        // If the CRM request was not successful (e.g., status 400 or 500)
        if (!crmResponse.ok) {
            const errorBody = await crmResponse.text(); // Get the raw response body
            console.error('--- CRM WEBHOOK ERROR DETAILS ---');
            console.error('Status:', crmResponse.status);
            console.error('Status Text:', crmResponse.statusText);
            console.error('Response Body:', errorBody); // This is the important part!
            console.error('---------------------------------');
            return { success: false, message: 'An error occurred with the CRM. Please try again.' };
        }

        // Success!
        return { success: true, message: 'Thank you for your message! We will get back to you shortly.' };

    } catch (error) {
        console.error('Fetch Error when connecting to CRM:', error);
        return { success: false, message: 'Could not connect to the CRM server. Please try again later.' };
    }
}
