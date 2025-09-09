import ReactPaginate from "react-paginate";
import styles from "./Pagination.module.css";

interface PaginationProps {
  pageCount: number;
  currentPage?: number; 
  onPageChange: (newPage: number) => void; 
}

export default function Pagination({
  pageCount,
  currentPage,
  onPageChange,
}: PaginationProps) {
  if (pageCount <= 1) return null;

  function handlePageChange(selectedItem: { selected: number }) {
   
    onPageChange(selectedItem.selected + 1);
  }

  return (
    <nav aria-label="Notes pagination" className={styles.wrapper}>
      <ReactPaginate
        pageCount={pageCount}
        onPageChange={handlePageChange}
        forcePage={typeof currentPage === "number" ? currentPage - 1 : undefined}
        marginPagesDisplayed={1}
        pageRangeDisplayed={3}
        previousLabel="←"
        nextLabel="→"
        breakLabel="…"
        containerClassName={styles.pagination}
        pageClassName={styles.page}
        pageLinkClassName={styles.link}
        previousClassName={styles.page}
        nextClassName={styles.page}
        previousLinkClassName={styles.link}
        nextLinkClassName={styles.link}
        breakClassName={styles.page}
        breakLinkClassName={styles.link}
        activeClassName={styles.active}
        disabledClassName={styles.disabled}
      />
    </nav>
  );
}