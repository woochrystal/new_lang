//PostInfoBox.jsx랑 같이 사용 필수

'use client';
import PostInfoTableCell from './TableCell';

export default function PostInfoTableRow({ row }) {
  return (
    // <tr key={index}>
    //   {row.map((cell, i) => (
    //     <PostInfoTableCell key={i}>{cell}</PostInfoTableCell>
    //   ))}
    // </tr>

    // th td구분, colspan 조절 추가
    <tr>
      {row.map((cell, i) => {
        // td가 기본, th정의는 isTh: true
        const Tag = cell.isTh ? 'th' : 'td';
        return (
          //{content:넣을요소, colspan : 숫자} 방식으로 사용
          // colspan 기본은 1
          <Tag key={i} colSpan={cell.colspan || 1}>
            {cell.content}
          </Tag>
        );
      })}
    </tr>
  );
}
