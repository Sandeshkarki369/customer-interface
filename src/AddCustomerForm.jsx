import { useState } from 'react';
import { supabase } from './supabase'; 

export default function AddCustomerForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Payload matches your new SQL schema
    const insertPayload = { 
      name: name, 
      email: email || null, 
      phone: phone || null // Sending as text, matching your new table
    };

    console.log("Sending payload:", insertPayload);

    const { data, error } = await supabase
      .from('customers')
      .insert([insertPayload]);

    if (error) {
      alert("Error saving to Supabase: " + error.message);
      console.error("Supabase Error:", error);
    } else {
      alert("Customer added successfully!");
      setName('');
      setEmail('');
      setPhone('');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleAddCustomer} className="p-4 bg-white rounded shadow-sm border border-stone-200">
      <h2 className="text-lg font-bold mb-4 font-display text-black">Add New Customer</h2>
      
      <label className="block text-sm font-medium text-stone-700 mb-1">Name (Required)</label>
      <input 
        className="border p-2 mb-3 w-full rounded text-black"
        type="text" 
        placeholder="John Doe" 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
        required
      />

      <label className="block text-sm font-medium text-stone-700 mb-1">Email (Must be unique)</label>
      <input 
        className="border p-2 mb-3 w-full rounded text-black"
        type="email" 
        placeholder="john@example.com" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
      />

      <label className="block text-sm font-medium text-stone-700 mb-1">Phone</label>
      <input 
        className="border p-2 mb-4 w-full rounded text-black"
        type="text" 
        placeholder="1234567890" 
        value={phone} 
        onChange={(e) => setPhone(e.target.value)} 
      />

      <button 
        type="submit" 
        className="bg-[#C15A2C] text-white p-2 rounded w-full font-medium transition-colors hover:bg-[#a3461f]"
        disabled={loading}
      >
        {loading ? 'Adding...' : 'Add Customer'}
      </button>
    </form>
  );
}