import { Helmet } from 'react-helmet-async';

const ProfilePage = () => {
  return (
    <>
      <Helmet>
        <title>Car Service Wale | Profile</title>
        <meta
          name="description"
          content="Manage personal details, vehicles, addresses, and preferences for tailored service experiences."
        />
      </Helmet>
      <div className="container-cs py-20">
        <h1 className="text-4xl font-bold">Profile</h1>
        <p className="mt-4 text-lg text-slate-600">Account settings UI will be composed in this view.</p>
      </div>
    </>
  );
};

export default ProfilePage;
