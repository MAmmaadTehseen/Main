/**
 * Progress Circle Component
 * Displays progress as a circular progress indicator with percentage text
 * Used to show project completion, task progress, etc.
 */

import "./ProgressCircle.css";

/**
 * PROGRESS CIRCLE COMPONENT
 * Renders an animated SVG circular progress bar
 *
 * @component
 * @param {Object} props - Component props
 * @param {number} props.percentage - Progress percentage (0-100)
 * @param {number} [props.size=120] - Diameter of the circle in pixels
 * @param {number} [props.strokeWidth=10] - Width of the progress stroke
 * @returns {React.ReactElement} SVG progress circle with percentage text
 *
 * @example
 * <ProgressCircle percentage={75} size={150} strokeWidth={8} />
 */
const ProgressCircle = ({ percentage, size = 120, strokeWidth = 10 }) => {
  // Calculate the radius from size
  const radius = (size - strokeWidth) / 2;

  // Calculate the circumference of the circle
  const circumference = radius * 2 * Math.PI;

  // Calculate stroke dash offset based on percentage
  // This creates the visual progress effect
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div
      className="progress-circle-container"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="progress-circle">
        {/* Background circle (unfilled part) */}
        <circle
          className="progress-circle-bg"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />

        {/* Foreground circle (filled/progress part) */}
        <circle
          className="progress-circle-fill"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference} // Set dash length to circumference
          strokeDashoffset={offset} // Offset creates the progress effect
          transform={`rotate(-90 ${size / 2} ${size / 2})`} // Rotate to start from top
        />
      </svg>

      {/* Percentage text in the center */}
      <div className="progress-circle-text">
        <span className="progress-percentage">{percentage}%</span>
      </div>
    </div>
  );
};

export default ProgressCircle;
