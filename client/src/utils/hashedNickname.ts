const hashString = (s: string) => {
  let h: number;
  let i: number;
  for (i = 0, h = 0; i < s.length; i += 1) {
    // eslint-disable-next-line no-bitwise
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
};

const adjectives = [
  '생활관축구대회태클마스터',
  '대학원연구실커피마스터',
  '탈모인협회장',
  '스터디카페케찹뺏어먹는',
  '훈련소에서탄피하나잃어버린',
  '변기뚜껑닫고볼일보는',
  '세탁소카사노바',
  '편의점카사노바',
  '동물원이유식연쇄절도범',
  '중화반점단무지도둑',
  '영어학원노숙자',
  '시내버스에어컨지배자',
  '무료급식소앞을서성이는',
  '수능갤러리삼수생',
];

const names = [
  '서우석',
  '막내',
  '지존이',
  '퉁퉁이',
  '하양이',
  '뽀로로',
  '크롱',
];

const getHashedNickName = (uuid: string) => {
  const hash = hashString(uuid);

  const adj = adjectives[hash % adjectives.length];
  const name = names[hash % names.length];

  return `${adj} ${name}`;
};

export { getHashedNickName };
