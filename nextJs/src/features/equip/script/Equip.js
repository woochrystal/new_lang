/**
 * @fileoverview Equip Entity
 * @description API 응답 데이터를 프론트엔드 모델에 맞게 변환하는 클래스
 */

export class Equip {
  /**
   * 장비 목록 API 응답을 프론트엔드 모델로 변환
   * @param {object} data - API 응답 데이터 아이템
   * @returns {object}
   */
  static fromListApi(data) {
    return {
      id: data.eqpId,
      assetNo: data.assetNo,
      eqpTy: data.eqpTy,
      eqpNm: data.eqpNm,
      eqpSt: data.eqpSt,
      buyDtm: data.buyDtm
    };
  }

  /**
   * 장비 상세 API 응답을 프론트엔드 모델로 변환
   * @param {object} data - API 응답 데이터
   * @returns {object}
   */
  static fromDetailApi(data) {
    if (!data) {
      return null;
    }
    return {
      eqpId: data.eqpId,
      assetNo: data.assetNo,
      buyDtm: data.buyDtm,
      eqpTy: data.eqpTy,
      eqpNm: data.eqpNm,
      serialNo: data.serialNo,
      owner: data.owner,
      eqpSt: data.eqpSt,
      usrNm: data.usrNm,
      note: data.note,
      possessionStatus: data.possessionStatus,
      history: data.history || [] // history 필드를 명시적으로 포함
    };
  }
}
