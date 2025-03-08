import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Team {
  id: number;
  name: string;
}

interface Match {
  week: number;
  home_team: Team;
  away_team: Team;
}

const WeekPage: React.FC = () => {
  const [fixtures, setFixtures] = useState<Match[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFixtures = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/fixture"); // Replace with your actual API
        if (!response.ok) {
          throw new Error("Failed to fetch fixtures");
        }
        const data = await response.json();
        setFixtures(data.data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchFixtures();
  }, []);

  // Group matches by week
  const groupedByWeek = fixtures.reduce<{ [key: number]: Match[] }>((acc, match) => {
    if (!acc[match.week]) {
      acc[match.week] = [];
    }
    acc[match.week].push(match);
    return acc;
  }, {});

  const handleStartSimulation = async () => {
      navigate("/fixture");
  };
  return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Weekly Fixtures</h1>
        {loading ? (
          <p>Loading fixtures...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="flex flex-row flex-wrap gap-6">
            {Object.entries(groupedByWeek).map(([week, matches]) => (
              <div key={week} className="bg-white shadow-md rounded-lg p-4 min-w-[300px]">
                <h2 className="text-xl font-semibold mb-2 text-center">Week {week}</h2>
                <table className="w-full border border-gray-300">
                  <thead className="bg-gray-200">
                  <tr>
                    <th className="border px-4 py-2 text-left">Home Team</th>
                    <th className="border px-4 py-2 text-left">Away Team</th>
                  </tr>
                  </thead>
                  <tbody>
                  {matches.map((match, index) => (
                    <tr key={index}>
                      <td className="border px-4 py-2">{match.home_team.name}</td>
                      <td className="border px-4 py-2">{match.away_team.name}</td>
                    </tr>
                  ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-row flex-wrap gap-6">
          <button
            onClick={() => handleStartSimulation()}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
          >
            Start Simulation
          </button>
        </div>
      </div>
  );
};

export default WeekPage;
