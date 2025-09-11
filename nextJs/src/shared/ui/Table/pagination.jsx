import styles from './pagination.module.scss';
export default function Pagination() {
  const pageNum = Array.from({ length: 6 }, (_, i) => i); //페이지 번호
  const clickNum = () => {};
  if (pageNum == 1) {
  }

  return (
    <div className={styles.paginationCustom}>
      <ul>
        <li>
          {/* 첫리스트화살표 << */}
          <a>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M6.3999 12.2666L2.13324 7.99993L6.3999 3.73327"
                stroke_width="1.2"
                stroke_linecap="round"
                stroke_linejoin="round"
              />
              <path
                d="M13.8662 12.2666L9.59954 7.99993L13.8662 3.73327"
                stroke_width="1.2"
                stroke_linecap="round"
                stroke_linejoin="round"
              />
            </svg>
          </a>
        </li>

        <li>
          <a>
            {/* 이전리스트화살표 < */}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 4L6 8L10 12" stroke_width="1.2" stroke_linecap="round" stroke_linejoin="round" />
            </svg>
          </a>
        </li>

        {/* 숫자리스트 */}
        {
          //페이지 번호
          pageNum.map((num, i) => {
            // console.log()
            return (
              <li key={i}>
                <a>{i + 1}</a>
              </li>
            );
          })
        }

        <li>
          <a>
            {/* 마지막리스트화살표 > */}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 4L10 8L6 12" stroke_width="1.2" stroke_linecap="round" stroke_linejoin="round" />
            </svg>
          </a>
        </li>

        <li>
          <a>
            {/* 이후리스트화살표 >> */}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M9.6001 12.2666L13.8668 7.99993L9.6001 3.73327"
                stroke_width="1.2"
                stroke_linecap="round"
                stroke_linejoin="round"
              />
              <path
                d="M2.13379 12.2666L6.40046 7.99993L2.13379 3.73327"
                stroke_width="1.2"
                stroke_linecap="round"
                stroke_linejoin="round"
              />
            </svg>
          </a>
        </li>
      </ul>
    </div>
  );
}
