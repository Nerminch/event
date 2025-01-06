import EventForm from "@/components/shared/EventForm";
import { getEventById } from "@/lib/actions/event.actions";
import { useUser } from "@clerk/nextjs";

type UpdateEventProps = {
  params: {
    id: string;
  };
};

const UpdateEvent = async ({ params: { id } }: UpdateEventProps) => {
  const { isLoaded, user } = useUser();

  // Vérifiez si l'utilisateur est chargé et connecté
  if (!isLoaded || !user) {
    return (
      <div className="wrapper my-8">
        <p className="text-center text-red-500">
          You must be logged in to update this event.
        </p>
      </div>
    );
  }

  // Obtenez l'ID utilisateur de Clerk
  const userId = user.id;

  // Récupération de l'événement
  const event = await getEventById(id);

  // Vérifiez si l'événement est trouvé
  if (!event) {
    return (
      <div className="wrapper my-8">
        <p className="text-center text-red-500">Event not found.</p>
      </div>
    );
  }

  // Vérifiez que l'utilisateur est autorisé à modifier l'événement
  if (event.userId !== userId) {
    return (
      <div className="wrapper my-8">
        <p className="text-center text-red-500">
          You do not have permission to update this event.
        </p>
      </div>
    );
  }

  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <h3 className="wrapper h3-bold text-center sm:text-left">
          Update Event
        </h3>
      </section>

      <div className="wrapper my-8">
        <EventForm
          type="Update"
          event={event}
          eventId={event._id}
          userId={userId}
        />
      </div>
    </>
  );
};

export default UpdateEvent;
