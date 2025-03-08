import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

interface Team {
  id: number;
  name: string;
}

interface TeamStats {
  id: number;
  name: string;
  wins: number;
  losses: number;
  draws: number;
  goals: number;
  goal_difference: number;
  points: number;
}

interface Fixture {
  id: number;
  home_team: Team;
  away_team: Team;
  home_score: number | null;
  away_score: number | null;
  week: number;
  result: string | null;
}

interface Prediction {
  id: number;
  name: string;
  parcentege: number;
}

const WeekPage: React.FC = () => {

  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [teamStats, setTeamStats] = useState<TeamStats[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      await handleNextMatches();
      await handleTeamStats();
    };

    fetchData();
  }, []);

  const handleNextMatches = async () => {
    try {
      setLoading(true);

      const fixturesResponse = await fetch("http://localhost:8000/api/fixture/next-matches");

      if (!fixturesResponse.ok) {
        throw new Error("Failed to fetch data");
      }
      const fixturesData = await fixturesResponse.json();
      setFixtures(fixturesData.data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }

    await handlePrediction();
  };

  const handleTeamStats = async () => {
    try {
      setLoading(true);

      const fixturePointResponse = await fetch("http://localhost:8000/api/teams/points");

      if (!fixturePointResponse.ok) {
        throw new Error("Failed to fixture points data");
      }
      const fixturePointsData = await fixturePointResponse.json();

      setTeamStats(fixturePointsData.data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handlePrediction = async () => {
    const predictionResponse = await fetch("http://localhost:8000/api/fixture/predictions");
    if (!predictionResponse.ok) {
      throw new Error("Failed to fetch prediction data");
    }
    const predictions = await predictionResponse.json();

    if (predictions.data && predictions.data.length > 0) {
      setPredictions(predictions.data);
    }
  };

  const handlePlayAll = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/fixture/play-all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Failed to play all fixtures");

      setMessage("All fixtures played successfully!");

      await handlePrediction();
      await handleTeamStats();

      setLoading(false);
    } catch (err) {
      setMessage((err as Error).message);
    }
  };

  const handlePlayNext = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/fixture/play", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to play next fixture");
      }

      setMessage("Next fixture played successfully!");
    } catch (err) {
      setMessage((err as Error).message);
    }
    await handlePrediction();
    await handleTeamStats();
  };

  const handleClearFixtures = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/fixture/delete", {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to clear fixtures");

      setMessage("Fixtures cleared successfully!");

      navigate("/");
    } catch (err) {
      setMessage((err as Error).message);
    }
  };

  return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Tournament Overview</h1>

        {loading ? (
          <p>Loading data...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="flex flex-row flex-wrap gap-6">
            {/* Prediction Table */}
            <div className="bg-white shadow-md rounded-lg p-4 min-w-[300px]">
              <h2 className="text-xl font-semibold mb-2 text-center">Team Points</h2>
              <table className="w-full border border-gray-300">
                <thead className="bg-gray-200">
                <tr>
                  <th className="border px-4 py-2">Team</th>
                  <th className="border px-4 py-2">W</th>
                  <th className="border px-4 py-2">L</th>
                  <th className="border px-4 py-2">D</th>
                  <th className="border px-4 py-2">GD</th>
                  <th className="border px-4 py-2">P</th>
                </tr>
                </thead>
                <tbody>
                {teamStats.map((stat) => (
                  <tr key={stat.id}>
                    <td className="border px-4 py-2">{stat.name}</td>
                    <td className="border px-4 py-2">{stat.wins}</td>
                    <td className="border px-4 py-2">{stat.losses}</td>
                    <td className="border px-4 py-2">{stat.draws}</td>
                    <td className="border px-4 py-2">{stat.goal_difference}</td>
                    <td className="border px-4 py-2">{stat.points}</td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>

            {/* Weekly Fixtures Table */}
            <div className="bg-white shadow-md rounded-lg p-4 min-w-[300px]">
              <h2 className="text-xl font-semibold mb-2 text-center">Weekly Fixtures</h2>
              <table className="w-full border border-gray-300">
                <thead className="bg-gray-200">
                <tr>
                  <th className="border px-4 py-2">Week</th>
                  <th className="border px-4 py-2">Home</th>
                  <th className="border px-4 py-2">Away</th>
                </tr>
                </thead>
                <tbody>
                {fixtures.map((match) => (
                  <tr key={match.id}>
                    <td className="border px-4 py-2">{match.week}</td>
                    <td className="border px-4 py-2">{match.home_team.name}</td>
                    <td className="border px-4 py-2">{match.away_team.name}</td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>

            {/* Latest Standings Table */}
            <div className="bg-white shadow-md rounded-lg p-4 min-w-[300px]">
              <h2 className="text-xl font-semibold mb-2 text-center">Predictions</h2>
              <table className="w-full border border-gray-300">
                <thead className="bg-gray-200">
                <tr>
                  <th className="border px-4 py-2">Team</th>
                  <th className="border px-4 py-2">Parcentege %</th>
                </tr>
                </thead>
                <tbody>
                {predictions.map((prediction) => (
                  <tr key={prediction.id}>
                    <td className="border px-4 py-2">{prediction.name}</td>
                    <td className="border px-4 py-2">{prediction.percentage}</td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-4 mt-4">
          <button onClick={handlePlayAll} className="bg-green-500 text-white px-4 py-2 rounded">Play All Weeks</button>
          <button onClick={handlePlayNext} className="bg-blue-500 text-white px-4 py-2 rounded">Play Next Week</button>
          <button onClick={handleClearFixtures} className="bg-red-500 text-white px-4 py-2 rounded">Clear Fixtures</button>
        </div>

        {message && <p className="mt-2 text-green-600">{message}</p>}
      </div>
  );
};

export default WeekPage;
