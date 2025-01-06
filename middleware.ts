import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Définir les routes publiques que nous voulons exclure de la protection
const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)']);

// Middleware Clerk pour gérer l'authentification et protéger les routes privées
export default clerkMiddleware(async (auth, request) => {
  // Si la route n'est pas publique, appliquer la protection
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

// Configuration de la gestion des routes, pour exclure les fichiers statiques et les fichiers internes de Next.js
export const config = {
  matcher: [
    // Exclure les fichiers internes de Next.js et les fichiers statiques
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Toujours inclure les routes API
    '/(api|trpc)(.*)',
  ],
};
