import Avatar from './Avatar';
import './LeaderboardRow.css';

const LeaderboardRow = ({ rank, displayName, avatarPath, totalScore, quizCount, isCurrentUser }) => (
  <div className={`leaderboard-row${isCurrentUser ? ' leaderboard-row--current' : ''}`}>
    <span className="leaderboard-row__rank">#{rank}</span>
    <Avatar src={avatarPath} displayName={displayName} size={40} />
    <span className="leaderboard-row__name">{displayName}</span>
    <div className="leaderboard-row__stats">
      <span className="leaderboard-row__score">{totalScore} pts</span>
      <span className="leaderboard-row__count">{quizCount} quiz{quizCount !== 1 ? 'zes' : ''}</span>
    </div>
  </div>
);

export default LeaderboardRow;
