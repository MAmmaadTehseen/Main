/**
 * Card Component
 * Reusable container component for displaying content in a card layout
 * Used throughout the application for projects, tasks, and other grouped content
 */

import "./Card.css";

/**
 * CARD COMPONENT
 * A flexible container with styling for cards
 *
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Content to display inside the card
 * @param {string} [props.className=''] - Additional CSS classes
 * @param {Function} [props.onClick] - Optional click handler for interactive cards
 * @returns {React.ReactElement} Styled card container
 *
 * @example
 * <Card onClick={() => navigate(`/project/${id}`)}>
 *   <h3>Project Name</h3>
 *   <p>Project description</p>
 * </Card>
 */
const Card = ({ children, className = "", onClick }) => {
  return (
    <div className={`card ${className}`} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;
