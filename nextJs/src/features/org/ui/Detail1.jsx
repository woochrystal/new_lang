import React from 'react';
import { Button, Label, RadioGroup, Input, Select } from '@/shared/component';
import { ORGANIZATION_CONSTANTS } from '@/features/org';
import styles from '@/shared/component/layout/layout.module.scss';

const OrganizationDetail = function ({
  organization,
  depth1List,
  depth2List,
  filteredDepth2List,
  onUpdate,
  onDelete,
  onChange,
  isCreating,
  onSaveNew,
  onCancelCreate,
  errors = {} // error prop 추가
}) {
  const isCompany = organization?.deptDepth === '0';
  const currentDepth = organization?.deptDepth || '1';

  const is1DepthSelectDisabled = isCreating
    ? currentDepth === '1'
    : !organization || isCompany || organization?.deptDepth === '1';

  const is2DepthSelectDisabled = isCreating
    ? currentDepth === '1' || currentDepth === '2'
    : !organization || isCompany || organization?.deptDepth !== '3';

  return (
    <>
      <div className={`${styles.titleSection} ${styles.titleWithButtonSection}`}>
        <div className={styles.sectionTitle}>
          <h3>조직정보는 3Depth까지 등록 가능합니다.</h3>
          {isCreating ? (
            <div className={styles.actionButtonContainer}>
              <Button variant="primary" onClick={onSaveNew}>
                저장
              </Button>
              <Button variant="secondary" onClick={onCancelCreate}>
                취소
              </Button>
            </div>
          ) : organization && !isCompany ? (
            <div className={styles.actionButtonContainer}>
              <Button
                variant="secondary"
                onClick={() => onChange && onChange('moveOrder', 'up')}
                disabled={!organization}
              >
                ▲
              </Button>
              <Button
                variant="secondary"
                onClick={() => onChange && onChange('moveOrder', 'down')}
                disabled={!organization}
              >
                ▼
              </Button>
              <Button variant="secondary" onClick={onUpdate}>
                수정
              </Button>
              <Button variant="secondary" onClick={onDelete}>
                삭제
              </Button>
            </div>
          ) : null}
        </div>
        <Label required>필수 입력 정보입니다.</Label>
      </div>

      <div className={`hasItem02 ${styles.depthSection}`}>
        <div>
          <Input
            label="조직명"
            value={organization?.deptNm || ''}
            onChange={(e) => onChange && onChange('deptNm', e.target.value)}
            required
            disabled={!isCreating && (!organization || isCompany)}
            placeholder="조직명"
            error={errors.deptNm}
          />
        </div>
        <div>
          <RadioGroup
            label="Depth"
            options={ORGANIZATION_CONSTANTS.DEPTH_OPTIONS}
            value={organization?.deptDepth || '1'}
            onChange={(v) => onChange && onChange('deptDepth', v)}
            bordered
            required
            disabled={!isCreating}
          />
        </div>
        <Select
          label="1Depth"
          options={depth1List
            .filter((d) => d.deptId !== organization?.id)
            .map((d) => ({ value: d.deptId, label: d.title }))}
          value={organization?.parent1DepthId ?? organization?.uppDeptId ?? ''}
          onChange={(v) => onChange && onChange('parent1DepthId', v)}
          disabled={is1DepthSelectDisabled}
          placeholder="1Depth"
          required
          error={errors.parent1DepthId}
        />
        <Select
          label="2Depth"
          options={(filteredDepth2List.length > 0 ? filteredDepth2List : depth2List)
            .filter((d) => d.deptId !== organization?.id)
            .map((d) => ({ value: d.deptId, label: d.title }))}
          value={organization?.parent2DepthId ?? ''}
          onChange={(v) => onChange && onChange('parent2DepthId', v)}
          disabled={is2DepthSelectDisabled}
          placeholder="2Depth"
          required
          error={errors.parent2DepthId}
        />
        {!isCreating && (
          <>
            <div>
              <Input label="생성일시" value={organization?.createdAt || ''} onChange={() => {}} disabled={true} />
            </div>
            <div>
              <Input label="수정일시" value={organization?.updatedAt || ''} onChange={() => {}} disabled={true} />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default OrganizationDetail;
