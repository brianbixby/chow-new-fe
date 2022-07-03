import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

const Navbar = lazy(() => import('../nav'));
const LandingContainer = lazy(() => import('../landing-container'));
const RecipesContainer = lazy(() => import('../recipes-container'));
const RecipeContainer = lazy(() => import('../recipe-container'));
const ProfileContainer = lazy(() => import('../profile-container'));
const NotFound = lazy(() => import('../notFound'));

function App() {
  return (
    <div>
      <div>
        <Navbar />
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<LandingContainer />} />
          <Route path="/profile/:userName" element={<ProfileContainer />} />
          <Route path="/search/:searchQuery" element={<RecipesContainer />} />
          <Route path="/recipe/:recipeQuery" element={<RecipeContainer />} />
          <Route path="*" element={<NotFound />}></Route>
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
