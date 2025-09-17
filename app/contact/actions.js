// app/contact/actions.js
'use server';

// This function will be called by our form
export async function sendContactMessage(previousState, formData) {
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const subject = formData.get('subject');
    const message = formData.get('message');
    const type = formData.get('type');

    // Basic validation
    if (!name || !email || !phone || !subject || !message || !type) {
        return { success: false, message: 'Please fill out all fields.' };
    }

    // Prepare CRM data
    const crmData = {
        name: name,
        phone: phone,
        email: email,
        comment: `Subject: ${subject}\n\n${message}`,
        type: type, // 1 for Buyer, 2 for Seller
        source: 'Website Contact Form',
        status: 1, // 1: lead
        lang: 'e', // Defaulting to English ('e'), change to 'f' for French if needed
        noty: 1, // Notify agent
    };

    // Prepare Telegram message
    const telegramText = `
*New Contact Form Submission*

*Name:* ${name}
*Email:* ${email}
*Phone:* ${phone}
*Type:* ${type === '1' ? 'Buyer' : 'Seller'}
*Subject:* ${subject}

*Message:*
${message}
    `;

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    const crmWebhookUrl = process.env.CRM_WEBHOOK_URL;

    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

    try {
        // We can run both requests in parallel for better performance
        const [telegramResponse, crmResponse] = await Promise.all([
            fetch(telegramUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: telegramText,
                    parse_mode: 'Markdown',
                }),
            }),
            fetch(crmWebhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(crmData),
            })
        ]);

        const telegramResult = await telegramResponse.json();
        const crmResult = await crmResponse.json(); // Assuming the CRM returns JSON

        // Check if both were successful
        if (telegramResult.ok && crmResponse.ok) {
            return { success: true, message: 'Thank you for your message! We will get back to you shortly.' };
        } else {
            // Log errors for debugging
            if (!telegramResult.ok) {
                console.error('Telegram API Error:', telegramResult);
            }
            if (!crmResponse.ok) {
                console.error('CRM Webhook Error:', crmResult);
            }
            return { success: false, message: 'Something went wrong. Please try again later.' };
        }

    } catch (error) {
        console.error('Fetch Error:', error);
        return { success: false, message: 'Could not connect to the server. Please try again later.' };
    }
}
