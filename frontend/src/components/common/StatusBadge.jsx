/**
 * Status Badge Component
 * Displays a colored badge for different status values
 * Used to show task status, submission status, approval status, etc.
 */

import "./StatusBadge.css";

/**
 * STATUS BADGE COMPONENT
 * Renders a colored badge with status text
 * Different colors indicate different status types
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.status - Status text to display
 * @returns {React.ReactElement} Colored status badge
 *
 * @example
 * <StatusBadge status="Approved" />
 * <StatusBadge status="Pending" />
 * <StatusBadge status="Completed" />
 */
const StatusBadge = ({ status }) => {
  /**
   * Determine CSS class based on status value
   * Maps status text to color styles:
   * - Green (success): approve, approved, completed, evaluated
   * - Yellow (pending): pending, submitted
   * - Red (error): rejected, overdue
   * - Gray (default): unknown statuses
   */
  const getStatusClass = () => {
    switch (status?.toLowerCase()) {
      // Success states - shown in green
      case "approve":
      case "approved":
      case "completed":
      case "evaluated":
        return "status-success";

      // Pending states - shown in yellow/orange
      case "pending":
      case "submitted":
        return "status-pending";

      // Error states - shown in red
      case "rejected":
      case "overdue":
        return "status-error";

      // Unknown status - shown in gray
      default:
        return "status-default";
    }
  };

  return <span className={`status-badge ${getStatusClass()}`}>{status}</span>;
};

export default StatusBadge;
