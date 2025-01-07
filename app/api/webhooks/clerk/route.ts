import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { createUser, deleteUser, updateUser } from "@/lib/actions/user.actions";
import { useUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhook -> choose the webhook
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occurred -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occurred", {
      status: 400,
    });
  }

  // Get the ID and type
  const { id } = evt.data;
  const eventType = evt.type;
//create user in mongodb
  if (eventType === "user.created") {
    const { email_addresses, image_url, first_name, last_name, username } = evt.data;

    // Ensure that firstName, lastName, username, and id are valid strings
    const user = {
      clerkId: id ,  // Default to an empty string if 'id' is undefined
      email: email_addresses[0].email_address,
      username: username ,  // Default to an empty string if username is null or undefined
      firstName: first_name ,  // Default to an empty string if first_name is null or undefined
      lastName: last_name ,  // Default to an empty string if last_name is null or undefined
      photo: image_url ,  // Default to an empty string if image_url is null or undefined
    };
console.log(user)
    const newUser = await createUser(user);

    if (newUser) {
      const client = useUser();
      if (client.user) {
        // Si l'utilisateur est connecté, on peut mettre à jour ses métadonnées
        await client.user.update({
          unsafeMetadata: { userId: newUser._id },  // Utilisation de 'unsafeMetadata' au lieu de 'metadata'
        });
      }
    }

    return NextResponse.json({ message: "OK", user: newUser });
  }

  if (eventType === "user.updated") {
    const { id, image_url, first_name, last_name, username } = evt.data;

    const user = {
      firstName: first_name || "",  // Default to an empty string if first_name is null
      lastName: last_name || "",    // Default to an empty string if last_name is null
      username: username || "",     // Default to an empty string if username is null or undefined
      photo: image_url || "",       // Default to an empty string if image_url is null
    };

    const updatedUser = await updateUser(id || "", user);  // Ensure id is a string

    return NextResponse.json({ message: "OK", user: updatedUser });
  }

  if (eventType === "user.deleted") {
    const { id } = evt.data;

    const deletedUser = await deleteUser(id || "");  // Ensure id is a string

    return NextResponse.json({ message: "OK", user: deletedUser });
  }

  return new Response("", { status: 200 });
}
