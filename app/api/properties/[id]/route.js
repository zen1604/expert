// app/api/properties/[id]/route.js
import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma'; // This path goes up 4 levels to the root `lib` folder

export async function GET(request, { params }) {
    const { id } = params;

    try {
        const property = await prisma.property.findUnique({
            where: {
                id: id,
                // We also check for visibility here to ensure hidden properties are not publicly accessible
                isVisible: true
            },
            include: {
                // We need to include the media for the gallery
                media: {
                    orderBy: {
                        createdAt: 'asc'
                    }
                },
            },
        });

        // If the database query returns nothing, send a 404 response
        if (!property) {
            return new NextResponse('Property not found', { status: 404 });
        }

        // If the property is found, send it back as JSON with a 200 OK status
        return NextResponse.json(property);

    } catch (error) {
        // If there's any other error (e.g., database connection issue), log it and send a 500 error
        console.error("API Error fetching property:", error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
