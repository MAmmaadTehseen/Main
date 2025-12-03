import './StatusBadge.css';

const StatusBadge = ({ status }) => {
  const getStatusClass = () => {
    switch (status?.toLowerCase()) {
      case 'approve':
      case 'approved':
      case 'completed':
      case 'evaluated':
        return 'status-success';
      case 'pending':
      case 'submitted':
        return 'status-pending';
      case 'rejected':
      case 'overdue':
        return 'status-error';
      default:
        return 'status-default';
    }
  };

  return (
    <span className={`status-badge ${getStatusClass()}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
