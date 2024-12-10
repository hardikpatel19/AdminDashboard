import "./LoadingSpinner.scss"
export const LoadingSpinner = () => {
  return (
    <div aria-label="Loading..." className="spinner-parent" role="status">
      <span class="loader"></span>
    </div>
  );
};
