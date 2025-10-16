'use client';
import InputFile from '../Input/InputFile';
import styles from './table.module.scss';

// 게시물 작성 하단 사용, 1줄/2개이상스타일 다 넣어둠
export default function PostInfoBox() {
  return (
    <>
      <div className={styles.postInfoBox}>
        <table className={styles.table}>
          <tbody>
            <tr>
              <th colSpan={1}>제목</th>
              <td colSpan={3}>
                <input id="title02" type="text" placeholder="제목 입력" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className={styles.postInfoBox}>
        <table className={styles.table}>
          <colgroup>
            {/* {colWidths.map((width, i) => (
                  <col key={i} style={{ width }} />
                ))} */}
            <col style={{ width: '120px' }} />
            <col style={{ width: 'calc(50% - 120px)' }} />
            <col style={{ width: '120px' }} />
            <col style={{ width: 'calc(50% - 120px)' }} />
          </colgroup>
          <tbody>
            <tr>
              <th>제목</th>
              <td>
                <input id="title03" type="text" placeholder="제목 입력" />
              </td>
              <th>제목</th>
              <td>
                <input id="title04" type="text" placeholder="제목 입력" />
              </td>
            </tr>
            <tr>
              <th colSpan={1}>파일첨부</th>
              <td colSpan={3}>
                <InputFile />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
