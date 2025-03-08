import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";

interface Team {
  id: number;
  name: string;
}

const MainPage: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/teams");
        if (!response.ok) {
          throw new Error("Failed to fetch teams");
        }
        const data = await response.json();
        setTeams(data.data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  const handleGenerateFixture = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/fixture/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to generate fixture");
      }

      navigate("/weeks");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <main className="flex-1 bg-gray-100 p-4">
          <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4">
            <h1 className="p-4">Tournament Teams</h1>
            {loading ? (
              <p>Loading teams...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <table className="min-w-full border border-gray-300">
                <thead className="bg-gray-200">
                <tr>
                  <th className="border px-4 py-2 text-left">Team Names</th>
                </tr>
                </thead>
                <tbody>
                {teams.map((team) => (
                  <tr key={team.id}>
                    <td className="border px-4 py-2">{team.name}</td>
                  </tr>
                ))}
                </tbody>
              </table>
            )}
          </div>
          <div className="flex flex-1 bg-gray-100 p-4 flex-col items-start">
            <button
              onClick={handleGenerateFixture}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
            >
              Generate Fixture
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainPage;
