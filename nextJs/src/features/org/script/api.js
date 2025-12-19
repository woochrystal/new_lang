/**
 * @fileoverview organization API 서비스
 * @description organization CRUD API 호출
 */

import { apiClient } from '@/shared/api/client';
import LoggerFactory from '@/shared/lib/logger';

const ENDPOINT = '/api/v1/organizations';
const logger = LoggerFactory.getLogger('organizationAPI');

/**
 * 조직 목록을 트리 구조로 변환
 */
const buildTree = function (flatList) {
  const map = {};
  const tree = [];

  // 1단계: 모든 노드를 맵에 저장
  flatList.forEach((item) => {
    map[item.deptId] = {
      key: String(item.deptId),
      title: item.deptNm,
      deptId: item.deptId,
      deptDepth: item.deptDepth,
      deptOrd: item.deptOrd,
      uppDeptId: item.uppDeptId,
      children: []
    };
  });

  // 2단계: 부모-자식 관계 설정
  flatList.forEach((item) => {
    if (item.uppDeptId && map[item.uppDeptId]) {
      map[item.uppDeptId].children.push(map[item.deptId]);
    } else {
      tree.push(map[item.deptId]);
    }
  });

  // 3단계: dept_ord로 정렬
  const sortByOrder = (nodes) => {
    nodes.sort((a, b) => a.deptOrd - b.deptOrd);
    nodes.forEach((node) => {
      if (node.children.length > 0) {
        sortByOrder(node.children);
      }
    });
  };
  sortByOrder(tree);

  return tree;
};

/**
 * 트리 데이터를 평탄화하여 모든 노드 추출
 */
const flattenTree = function (tree) {
  const result = [];
  const traverse = (nodes) => {
    nodes.forEach((node) => {
      result.push(node);
      if (node.children && node.children.length > 0) {
        traverse(node.children);
      }
    });
  };
  traverse(tree);
  return result;
};

export const api = {
  /**
   * 조직 목록을 조회합니다. (검색 지원)
   * GET /api/v1/organizations
   */
  async getList(params = {}) {
    const { data } = await apiClient.get(ENDPOINT, {
      params,
      _onSuccess: (response) => response.data || []
    });
    return data;
  },

  /**
   * 조직 트리 구조를 조회합니다.
   */
  async getTree(params = {}) {
    const list = await this.getList(params);
    return buildTree(list);
  },

  /**
   * 특정 조직의 상세 정보를 조회합니다.
   * GET /api/v1/organizations/{deptId}
   */
  async get(deptId) {
    const { data } = await apiClient.get(`${ENDPOINT}/${deptId}`, {
      _onSuccess: (response) => response.data
    });
    return data;
  },

  /**
   * 조직원 목록을 조회합니다.
   * GET /api/v1/organizations/{deptId}/members
   */
  async getMembers(deptId, params = {}) {
    const { page = 1, size = 10 } = params;

    const { data } = await apiClient.get(`${ENDPOINT}/${deptId}/members`, {
      params: { page, size },
      _onSuccess: (response) => response.data
    });

    return data;
  },

  /**
   * 조직을 생성합니다.
   * POST /api/v1/organizations
   */
  async create(orgData) {
    const { data } = await apiClient.post(ENDPOINT, {
      ...orgData,
      _onSuccess: (response) => (response.status === 201 ? true : response.data)
    });
    return data;
  },

  /**
   * 조직을 수정합니다.
   * PUT /api/v1/organizations/{deptId}
   */
  async update(deptId, orgData) {
    if (!orgData) {
      logger.error(`[api.update] 조직(ID: ${deptId}) 수정 실패: orgData가 null입니다.`);
      return null;
    }

    try {
      const { data } = await apiClient.put(`${ENDPOINT}/${deptId}`, {
        ...orgData,
        _onSuccess: (response) => response.data
      });
      return data;
    } catch (error) {
      logger.error(`[api.update] 조직(ID: ${deptId}) 수정 실패:`, error);
      return null;
    }
  },

  async bulkMoveDept(payload) {
    const { userIds, targetDeptId } = payload;
    if (!userIds) {
      logger.error(`[api.bulkMoveDept] 부서 이동 실패: userIds가 null입니다.`);
      return null;
    }
    if (!targetDeptId) {
      logger.error(`[api.bulkMoveDept] 부서 이동 실패: targetDeptId가 null입니다.`);
      return null;
    }

    try {
      const { data } = await apiClient.put(
        `${ENDPOINT}/members/move`,
        { userIds, targetDeptId }, // payload 전체가 아닌 필드만 전송
        { _onSuccess: (response) => response.data || true }
      );
      return data;
    } catch (error) {
      logger.error(`[api.bulkMoveDept] 부서 이동 실패:`, error);
      return null;
    }
  },

  /**
   * 조직 순서를 변경합니다.
   * PUT /api/v1/organizations/order
   */
  async updateOrder(orders) {
    const { data } = await apiClient.put(`${ENDPOINT}/order`, {
      orders,
      _onSuccess: () => true
    });
    return data;
  },

  /**
   * 조직을 삭제합니다.
   * DELETE /api/v1/organizations/{deptId}
   */
  async delete(deptId) {
    const { error } = await apiClient.delete(`${ENDPOINT}/${deptId}`, {
      _onSuccess: () => true,
      _onError: (error) => {
        logger.error(`[api.delete] 조직(ID: ${deptId}) 삭제 실패:`, error);
        return error;
      }
    });
    return !error;
  },

  /**
   * 특정 depth의 조직 목록 가져오기
   */
  getByDepth(treeData, depth) {
    const flatList = flattenTree(treeData);
    return flatList.filter((item) => item.deptDepth === String(depth));
  }
};
