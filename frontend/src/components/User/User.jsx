import React, { useEffect, useState } from 'react';
import './User.css';

const User = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addAmount, setAddAmount] = useState(100); // Default amount to add

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userId = localStorage.getItem('userId'); // Get userId from localStorage
      const token = localStorage.getItem('userToken'); // Get JWT token from localStorage

      if (!userId || !token) {
        setError('User not logged in or token missing.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/user/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Set Authorization header
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user details');
        }

        const data = await response.json();
        setUserDetails(data); // Set user details state
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails(); // Call the function to fetch user details
  }, []); // Empty dependency array means this effect runs once on mount

  const handleAddMoney = async () => {
    const userId = localStorage.getItem('userId'); // Get userId from localStorage
    const token = localStorage.getItem('userToken'); // Get JWT token from localStorage

    if (!userId || !token) {
      setError('User not logged in or token missing.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/user/addBalance`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`, // Set Authorization header
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          amount: addAmount, // Amount to add
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add balance');
      }
      window.location.href = '/profile';
      

      const result = await response.json();
      alert(result.message || 'Balance added successfully!'); // Notify user of success
      fetchUserDetails(); // Refresh user details to show updated balance
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Loading state
  }

  if (error) {
    return <div className="error-message">{error}</div>; // Error state
  }

  return (
    <div className="user-details">
      <h1>User Details</h1>
      {userDetails && (
        <div className="user-info">
          <img src={`http://localhost:5000/user/uploads/${userDetails.image || 'default.jpg'}`} alt="User Profile" className="user-image" />
          <p><strong>Name:</strong> {userDetails.name}</p>
          <p><strong>Email:</strong> {userDetails.email}</p>
          
          {/* Wallet Information */}
          <div className="wallet-info">
            <h2>Wallet</h2>
            <p><strong>Balance:</strong> ${userDetails.wallet.balance}</p>
            <h3>Transactions:</h3>
            <ul className="transaction-list">
              {userDetails.wallet.transactions.map((transaction) => (
                <li key={transaction._id} className={`transaction-item ${transaction.type}`}>
                  <span>{transaction.date.split('T')[0]}</span>
                  <span>{transaction.type === 'credit' ? '+' : '-'}${transaction.amount}</span>
                  {transaction.description && <span> - {transaction.description}</span>}
                </li>
              ))}
            </ul>
            {/* Add Money Button */}
            <div className="add-money">
              <input 
                type="number" 
                value={addAmount} 
                onChange={(e) => setAddAmount(Number(e.target.value))} 
                min="1"
              />
              <button onClick={handleAddMoney}>Add Money</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default User;
