"use client";

import { useUser } from '@clerk/nextjs';
import EventForm from "@/components/shared/EventForm";

const CreateEvent = () => {
  const { user, isLoaded } = useUser();  // Assurez-vous que l'importation est correcte

  if (!isLoaded) {
    return <p>Loading...</p>;  // Affiche un message de chargement si l'utilisateur n'est pas encore chargé
  }

  if (!user) {
    return <p>Please sign in to create an event.</p>;  // Si l'utilisateur n'est pas connecté, demandez-le de se connecter
  }

  const userId = user?.id;  // Récupère l'ID de l'utilisateur une fois qu'il est chargé

  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <h3 className="wrapper h3-bold text-center sm:text-left">
          Create Event
        </h3>
      </section>

      <div className="wrapper my-8">
        <EventForm userId={userId} type="Create" />
      </div>
    </>
  );
};

export default CreateEvent;
