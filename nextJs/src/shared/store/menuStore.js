/*
 * path           : src/shared/store/menuStore.js
 * fileName       : menuStore
 * author         : changhyeon
 * date           : 25. 11. 07.
 * description    : 권한 기반 메뉴 트리 로드 및 캐싱
 * ===========================================================
 * DATE              AUTHOR        NOTE
 * -----------------------------------------------------------
 * 25. 11. 05.       changhyeon       최초 생성
 * 25. 11. 07.       changhyeon       인증 우회시 백엔드 데이터 모킹 처리
 * 25. 11. 11.       changhyeon       메뉴 로드 실패시 폴백 메뉴 추가
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { mockData } from '@/shared/api/mock/mockService';
import { authApi } from '@/shared/auth/authApi';
import { shouldBypassAuth } from '@/shared/auth/utils/devMode';

/**
 * 메뉴 로드 실패 시 사용할 기본 폴백 메뉴
 * API 호출 실패 시에도 사용자가 최소한의 기능을 사용할 수 있도록 제공
 */
const FALLBACK_MENU = [
  {
    menuId: 1,
    menuNm: '대시보드',
    menuUrl: '/dashboard',
    uppMenuId: null,
    menuDepth: '1',
    menuOrd: 1,
    children: []
  }
];

/**
 * @typedef {Object} MenuODT
 * @property {number} menuId - 메뉴 고유 ID
 * @property {string} menuNm - 메뉴 이름
 * @property {number|null} uppMenuId - 상위 메뉴 ID
 * @property {string} menuDepth - 메뉴 깊이 (1, 2, 3...)
 * @property {string} menuUrl - 메뉴 URL
 * @property {number} menuOrd - 정렬 순서
 * @property {MenuODT[]} children - 자식 메뉴 목록
 */

export const useMenuStore = create(
  immer((set, get) => ({
    // ===== 사용자 메뉴 (사이드바) =====
    menuTree: null, // 원본 메뉴 트리 (백엔드에서 받은 것)
    flatMenuMap: {}, // { menuId: MenuODT } - 빠른 조회용
    isLoading: false,
    error: null,

    // ===== 관리자 메뉴 트리 =====
    adminTreeData: null,
    adminIsLoading: false,
    adminError: null,
    adminExpandedKeys: [],

    /**
     * 백엔드 형식 → 프론트엔드 형식으로 변환
     * 백엔드: name, parentId, sortOrder, depth
     * 프론트엔드: menuNm, uppMenuId, menuOrd, menuDepth
     */
    convertMenuFormat: (menu) => {
      if (!menu) {
        return null;
      }

      return {
        menuId: menu.menuId,
        menuNm: menu.name || menu.menuNm,
        uppMenuId: menu.parentId !== undefined ? menu.parentId : menu.uppMenuId,
        menuOrd: menu.sortOrder !== undefined ? menu.sortOrder : menu.menuOrd,
        menuDepth: menu.depth !== undefined ? String(menu.depth) : menu.menuDepth,
        menuUrl: menu.menuUrl,
        menuIcon: menu.menuIcon,
        useYn: menu.useYn,
        assignRole: menu.assignRole,
        children: menu.children?.map((c) => get().convertMenuFormat(c)) || []
      };
    },

    /**
     * 메뉴 트리 로드
     *
     * 동작 흐름:
     * 1. menuApi.getMenuTree() 호출하여 백엔드에서 메뉴 트리 데이터 조회
     * 2. 백엔드 형식 → 프론트엔드 형식으로 변환
     * 3. 빠른 조회를 위해 트리 구조를 { menuId: menuObject } 형태의 평탄한 맵(flatMenuMap)으로 변환
     * 4. 원본 트리(menuTree)와 평탄화된 맵(flatMenuMap)을 스토어 상태에 저장
     */
    loadMenuTree: async () => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      let data;

      // BYPASS_AUTH 모드: Mock 메뉴 데이터 사용
      if (shouldBypassAuth()) {
        data = mockData.menus;
      } else {
        const { data: result, error } = await authApi.getMenuTree();
        data = result;
        if (error || !data) {
          // 메뉴 로드 실패 시 폴백 메뉴 사용

          const flatMap = {};
          FALLBACK_MENU.forEach((item) => {
            flatMap[item.menuId] = item;
          });

          set((state) => {
            state.menuTree = FALLBACK_MENU;
            state.flatMenuMap = flatMap;
            state.isLoading = false;
            state.error = error?.message || '메뉴를 불러올 수 없습니다. 기본 메뉴를 사용합니다.';
          });
          return;
        }
      }

      // 백엔드 형식 → 프론트엔드 형식으로 변환
      const convertedData = data.map((menu) => get().convertMenuFormat(menu));

      // Flat Map 생성 (빠른 조회용)
      const flatMap = {};
      const flatten = (items) => {
        items.forEach((item) => {
          flatMap[item.menuId] = item;
          if (item.children?.length > 0) {
            flatten(item.children);
          }
        });
      };
      flatten(convertedData);

      set((state) => {
        state.menuTree = convertedData;
        state.flatMenuMap = flatMap;
        state.isLoading = false;
      });
    },

    /**
     * menuId로 메뉴 찾기
     * @param {number} menuId
     * @returns {MenuODT|null}
     */
    findMenuById: (menuId) => {
      return get().flatMenuMap[menuId] || null;
    },

    /**
     * menuUrl로 메뉴 찾기
     * @param {string} menuUrl
     * @returns {MenuODT|null}
     */
    findMenuByUrl: (menuUrl) => {
      const { flatMenuMap } = get();
      return Object.values(flatMenuMap).find((m) => m.menuUrl === menuUrl) || null;
    },

    /**
     * Breadcrumb 생성
     * 특정 메뉴부터 루트까지의 경로
     *
     * @param {number} menuId
     * @returns {MenuODT[]} breadcrumb 배열 (루트부터 시작)
     */
    getBreadcrumb: (menuId) => {
      const { flatMenuMap } = get();
      const breadcrumb = [];
      let current = flatMenuMap[menuId];

      while (current) {
        breadcrumb.unshift(current);
        current = current.uppMenuId ? flatMenuMap[current.uppMenuId] : null;
      }

      return breadcrumb;
    },

    /**
     * 메뉴 초기화
     */
    clearMenu: () => {
      set((state) => {
        state.menuTree = null;
        state.flatMenuMap = {};
        state.isLoading = false;
        state.error = null;
      });
    },

    // ===== 관리자 메뉴 트리 관리 메서드 =====

    // 낙관적 업데이트를 위한 이전 상태 저장소
    _adminTreeStash: null,
    _userTreeStash: null,

    /**
     * 낙관적 업데이트를 위한 현재 상태 저장 (관리자 + 사용자 트리)
     */
    stashAdminTree: () => {
      set((state) => {
        state._adminTreeStash = state.adminTreeData ? JSON.parse(JSON.stringify(state.adminTreeData)) : null;
        state._userTreeStash = state.menuTree ? JSON.parse(JSON.stringify(state.menuTree)) : null;
      });
    },

    /**
     * 저장된 상태로 롤백 (관리자 + 사용자 트리)
     */
    rollbackAdminTree: () => {
      set((state) => {
        if (state._adminTreeStash) {
          state.adminTreeData = JSON.parse(JSON.stringify(state._adminTreeStash));
        }
        if (state._userTreeStash) {
          state.menuTree = JSON.parse(JSON.stringify(state._userTreeStash));
          // flatMap도 재생성
          const flatMap = {};
          const flatten = (items) => {
            items.forEach((item) => {
              flatMap[item.menuId] = item;
              if (item.children?.length > 0) {
                flatten(item.children);
              }
            });
          };
          flatten(state.menuTree);
          state.flatMenuMap = flatMap;
        }
        state._adminTreeStash = null;
        state._userTreeStash = null;
      });
    },

    /**
     * 낙관적 업데이트 성공 후 스태시 정리
     */
    clearAdminTreeStash: () => {
      set((state) => {
        state._adminTreeStash = null;
        state._userTreeStash = null;
      });
    },

    /**
     * 관리자 메뉴 트리 로드
     * @param {Function} apiCall - API 호출 함수 (테스트용 Mock 지원)
     */
    loadAdminTree: async (apiCall = null) => {
      set((state) => {
        state.adminIsLoading = true;
        state.adminError = null;
      });

      try {
        // BYPASS_AUTH 모드: Mock 데이터 사용
        if (shouldBypassAuth()) {
          const mockAdminData = mockData.adminMenus || [];
          set((state) => {
            state.adminTreeData = mockAdminData;
            state.adminIsLoading = false;
          });
          get().filterValidAdminExpandedKeys(mockAdminData);
          return;
        }

        // API 호출 (외부에서 주입 가능)
        let data;
        if (apiCall) {
          data = await apiCall();
        } else {
          // 기본 API 호출 (필요시 구현)
          throw new Error('API function not provided');
        }

        set((state) => {
          let safeData = [];
          if (Array.isArray(data)) {
            safeData = data;
          } else if (data) {
            safeData = [data];
          }
          state.adminTreeData = safeData;
          state.adminIsLoading = false;
        });

        // 확장 키 유효성 검사
        get().filterValidAdminExpandedKeys(data);
      } catch (error) {
        set((state) => {
          state.adminIsLoading = false;
          state.adminError = error?.message || '관리자 메뉴를 불러올 수 없습니다.';
        });
      }
    },

    /**
     * 관리자 트리 확장 상태 설정
     * @param {string[]} keys - 확장된 노드 키 배열
     */
    setAdminExpandedKeys: (keys) => {
      set((state) => {
        state.adminExpandedKeys = Array.isArray(keys) ? keys : [];
      });
    },

    /**
     * 확장된 키 추가
     * @param {string} key - 추가할 키
     */
    addAdminExpandedKey: (key) => {
      set((state) => {
        if (!state.adminExpandedKeys.includes(key)) {
          state.adminExpandedKeys = [...state.adminExpandedKeys, key];
        }
      });
    },

    /**
     * 확장된 키 제거
     * @param {string} key - 제거할 키
     */
    removeAdminExpandedKey: (key) => {
      set((state) => {
        state.adminExpandedKeys = state.adminExpandedKeys.filter((k) => k !== key);
      });
    },

    /**
     * 모든 확장 상태 초기화
     */
    clearAdminExpandedKeys: () => {
      set((state) => {
        state.adminExpandedKeys = [];
      });
    },

    /**
     * 유효한 확장 키 필터링
     * 트리 데이터 변경 시 유효한 키만 남기고 나머지는 제거
     * @param {Array} treeData - 트리 데이터
     */
    filterValidAdminExpandedKeys: (treeData) => {
      set((state) => {
        if (!treeData || !Array.isArray(treeData)) {
          state.adminExpandedKeys = [];
          return;
        }

        const allKeys = new Set();
        const collectKeys = (nodes) => {
          nodes.forEach((node) => {
            allKeys.add(String(node.menuId));
            if (node.children && node.children.length > 0) {
              collectKeys(node.children);
            }
          });
        };

        collectKeys(treeData);
        const validKeys = state.adminExpandedKeys.filter((key) => allKeys.has(key));

        if (validKeys.length !== state.adminExpandedKeys.length) {
          state.adminExpandedKeys = validKeys;
        }
      });
    },

    /**
     * 사용자 메뉴 트리에도 동일한 변경 적용 (필드명 변환 포함)
     * @param {Object} updateData - 업데이트할 데이터 (관리자 형식)
     * @param {string} operation - 'create' | 'update' | 'delete'
     * @param {number} targetId - 대상 메뉴 ID (update/delete 시 사용)
     */
    updateUserMenuTree: (updateData, operation, targetId = null) => {
      set((state) => {
        if (!state.menuTree || !Array.isArray(state.menuTree)) {
          return;
        }

        const newMenuTree = JSON.parse(JSON.stringify(state.menuTree));
        let hasChanges = false;

        // 관리자 형식 → 사용자 형식 변환
        const convertToUserFormat = (adminData) => {
          const userFormat = {};
          if (adminData.name !== undefined) {
            userFormat.menuNm = adminData.name;
          }
          if (adminData.menuUrl !== undefined) {
            userFormat.menuUrl = adminData.menuUrl;
          }
          if (adminData.parentId !== undefined) {
            userFormat.uppMenuId = adminData.parentId || null;
          }
          if (adminData.sortOrder !== undefined) {
            userFormat.menuOrd = adminData.sortOrder;
          }
          if (adminData.order !== undefined) {
            userFormat.menuOrd = adminData.order;
          }
          if (adminData.assignRole !== undefined) {
            userFormat.assignRole = adminData.assignRole;
          }
          if (adminData.useYn !== undefined) {
            userFormat.useYn = adminData.useYn;
          }
          if (adminData.menuIcon !== undefined) {
            userFormat.menuIcon = adminData.menuIcon;
          }
          return userFormat;
        };

        const updateNodeAtPath = (nodes) => {
          for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];

            switch (operation) {
              case 'update':
                if (String(node.menuId) === String(targetId)) {
                  const userFormatData = convertToUserFormat(updateData);
                  nodes[i] = { ...nodes[i], ...userFormatData };
                  hasChanges = true;
                  return true;
                }
                break;

              case 'delete':
                if (String(node.menuId) === String(targetId)) {
                  nodes.splice(i, 1);
                  hasChanges = true;
                  return true;
                }
                if (node.children) {
                  const childIndex = node.children.findIndex((c) => String(c.menuId) === String(targetId));
                  if (childIndex !== -1) {
                    nodes[i].children = node.children.filter((c) => c.menuId !== targetId);
                    hasChanges = true;
                    return true;
                  }
                }
                break;

              case 'create':
                if (String(node.menuId) === String(updateData.parentId)) {
                  if (!nodes[i].children) {
                    nodes[i].children = [];
                  }
                  const userFormatData = convertToUserFormat(updateData);
                  nodes[i].children.push({
                    menuId: `temp-${Date.now()}`,
                    ...userFormatData,
                    children: []
                  });
                  hasChanges = true;
                  return true;
                }
                break;
            }

            if (node.children && node.children.length > 0) {
              if (updateNodeAtPath(node.children)) {
                return true;
              }
            }
          }
          return false;
        };

        updateNodeAtPath(newMenuTree);

        if (hasChanges) {
          state.menuTree = newMenuTree;

          // flatMap 재생성
          const flatMap = {};
          const flatten = (items) => {
            items.forEach((item) => {
              flatMap[item.menuId] = item;
              if (item.children?.length > 0) {
                flatten(item.children);
              }
            });
          };
          flatten(newMenuTree);
          state.flatMenuMap = flatMap;
        }
      });
    },

    /**
     * 낙관적 업데이트 - 메뉴 생성/수정 시 즉시 트리 업데이트
     * @param {Object} updateData - 업데이트할 데이터
     * @param {string} operation - 'create' | 'update' | 'delete'
     * @param {number} targetId - 대상 메뉴 ID (update/delete 시 사용)
     */
    optimisticAdminTreeUpdate: (updateData, operation, targetId = null) => {
      // 업데이트 전 현재 상태 저장 (롤백 대비)
      get().stashAdminTree();

      set((state) => {
        // Ensure we handle object vs array just in case
        let currentAdminTree = state.adminTreeData;
        if (currentAdminTree && !Array.isArray(currentAdminTree)) {
          // Should be handled by loadAdminTree, but defensive
          currentAdminTree = [currentAdminTree];
        }

        if (!currentAdminTree || !Array.isArray(currentAdminTree)) {
          return;
        }

        // 참조를 고려해 깊은 복사 최소화
        const newTreeData = [...currentAdminTree];
        let hasChanges = false;

        // 변경이 필요한 노드와 그 부모 경로만 찾아서 업데이트
        const updateNodeAtPath = (nodes, path = []) => {
          for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            const currentPath = [...path, i];

            switch (operation) {
              case 'create':
                // 상위 메뉴에 자식 추가
                if (String(node.menuId) === String(updateData.parentId)) {
                  if (!nodes[i].children) {
                    nodes[i] = { ...node, children: [] };
                  }
                  nodes[i] = {
                    ...nodes[i],
                    children: [
                      ...nodes[i].children,
                      {
                        menuId: `temp-${Date.now()}`,
                        ...updateData,
                        children: []
                      }
                    ]
                  };
                  hasChanges = true;
                  return true;
                }
                break;

              case 'update':
                // 특정 노드 업데이트
                if (String(node.menuId) === String(targetId)) {
                  nodes[i] = { ...node, ...updateData };
                  hasChanges = true;
                  return true;
                }
                break;

              case 'delete':
                // 노드 삭제
                if (String(node.menuId) === String(targetId)) {
                  nodes.splice(i, 1);
                  hasChanges = true;
                  return true;
                }
                // 자식 노드에서 삭제
                if (node.children) {
                  const childIndex = node.children.findIndex((child) => String(child.menuId) === String(targetId));
                  if (childIndex !== -1) {
                    nodes[i] = {
                      ...node,
                      children: node.children.filter((child) => child.menuId !== targetId)
                    };
                    hasChanges = true;
                    return true;
                  }
                }
                break;
            }

            // 재귀적으로 자식 노드 탐색
            if (node.children && node.children.length > 0) {
              if (updateNodeAtPath(node.children, currentPath)) {
                return true;
              }
            }
          }
          return false;
        };

        updateNodeAtPath(newTreeData);

        // 변경이 있을 경우에만 상태 업데이트
        if (hasChanges) {
          state.adminTreeData = newTreeData;
        }
      });

      // 사용자 메뉴 트리에도 동일한 변경 적용 (필드명 변환 포함)
      get().updateUserMenuTree(updateData, operation, targetId);
    }
  })),
  {
    name: 'menu-store-storage',
    // 관리자 트리 확장 상태만 영구 보존
    partialize: (state) => ({
      adminExpandedKeys: state.adminExpandedKeys
    })
  }
);
