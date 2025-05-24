import axios from "axios";

export async function getExistingShapes(roomId: string) {
    // try {
    //     const response = await axios.get("http://localhost:3001/chat/8", {
    //         headers: {
    //             Authorization: `Bearer ${"hardcoded token value for testing"}`, //FIXME: include token afterward
    //         },
    //     });
    //     if (response.status === 200) {
    //         const chats = response.data.messages;
    //         const shapes = chats.map((x: any) => {
    //             const shape = JSON.parse(x.message);
    //             return shape;
    //         });
    //         return shapes;
    //     } else {
    //         return "An error occured while getting shapes.";
    //     }
    // } catch (err) {
    //     if (axios.isAxiosError(err)) {
    //         return err.response?.data?.message;
    //     }
    //     return null;
    // } finally {
    //     return "this is the final block , meaning request not handled.";
    // }
    const response = await axios.get("http://localhost:3001/chat/8", {
        headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkaWxAZ21haWwuY29tIiwiaWQiOiI4YmVhYTcyYy0xOGVhLTQ3M2YtOTUxNy0zZDM0YzMyZmZjMjQiLCJpYXQiOjE3NDgwNjA4MDQsImV4cCI6MTc0ODEwNDAwNH0.q-IOQnZAANKg8kv9_O6u1UfkLDC2AEgrytepRjRRdxw`,
        },
    });

    const chats = response.data.messages;
    const shapes = chats.map((chat: any) => {
        const shape = JSON.parse(chat.message);
        return shape;
    });
    return shapes;
}
