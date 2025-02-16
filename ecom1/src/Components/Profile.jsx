import Navbar from './Navbar'
import { useUser } from './UserAuthContext';
import { Link } from 'react-router-dom';

const Profile = () => {
  const loggeduser = useUser();

  return (
    <div>
      <Navbar />    
      <div>
        {loggeduser ? (
          <div>
            <h1 className="text-center p-4">Din profil </h1>
            <div className="d-flex justify-content-center">
              <table className="table table-striped table-bordered w-50">
                <thead>
                  <tr>
                    <th>Namn</th>
                    <th>Email</th>
                    <th>Lösenord</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{loggeduser[0].username}</td>
                    <td>{loggeduser[0].email}</td>
                    <td>{loggeduser[0].password}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center p-4">
            <h1>Logga in för att se din profil</h1>
            <Link to="/login" className="btn btn-primary mt-3">Gå till inloggning</Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile