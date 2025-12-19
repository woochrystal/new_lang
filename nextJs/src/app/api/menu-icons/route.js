import fs from 'fs';
import path from 'path';

import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    // 기본 아이콘 경로
    const iconDir = path.join(process.cwd(), 'public', 'menuIcon');

    // 디렉토리가 없으면 빈 배열 반환
    if (!fs.existsSync(iconDir)) {
      return NextResponse.json({ files: [] });
    }

    // 파일 읽기
    const files = fs.readdirSync(iconDir, { withFileTypes: true });

    // 파일만 필터링 후 경로 매핑
    const iconFiles = files
      .filter((file) => file.isFile() && /\.(svg|png|jpg|jpeg|gif)$/i.test(file.name))
      .map((file) => ({
        label: file.name,
        value: `/menuIcon/${file.name}`
      }));

    // 하위 폴더는 탐색시 별도 로직 필요
    return NextResponse.json({ icons: iconFiles });
  } catch (error) {
    console.error('Failed to read icon directory:', error);
    return NextResponse.json({ error: 'Failed to fetch icons' }, { status: 500 });
  }
}
