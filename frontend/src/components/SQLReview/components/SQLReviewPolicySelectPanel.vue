<template>
  <Drawer :show="show" @close="$emit('close')">
    <DrawerContent
      :title="$t('sql-review.select-review')"
      class="w-[60rem] max-w-[100vw] relative"
    >
      <template #default>
        <div class="space-y-4">
          <i18n-t
            keypath="sql-review.select-review-label"
            tag="p"
            class="textinfolabel"
          >
            <template #create>
              <NButton
                text
                type="primary"
                class="normal-link lowercase"
                @click="createPolicy"
                @disabled="!allowCreateSQLReviewPolicy"
              >
                {{ $t("sql-review.create-policy") }}
              </NButton>
            </template>
          </i18n-t>
          <SQLReviewPolicyDataTable
            :size="'small'"
            :review-list="sqlReviewStore.reviewPolicyList"
            :allow-edit="false"
            :custom-click="true"
            @row-click="onReviewSelect"
          />
        </div>
      </template>
      <template #footer>
        <div class="flex items-center justify-end gap-x-3">
          <NButton @click="$emit('close')">
            {{ $t("common.cancel") }}
          </NButton>
        </div>
      </template>
    </DrawerContent>
  </Drawer>
</template>

<script setup lang="ts">
import { watchEffect, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { Drawer, DrawerContent } from "@/components/v2";
import { WORKSPACE_ROUTE_SQL_REVIEW_CREATE } from "@/router/dashboard/workspaceRoutes";
import { useSQLReviewStore, useCurrentUserV1, pushNotification } from "@/store";
import type { SQLReviewPolicy } from "@/types";
import { hasWorkspacePermissionV2 } from "@/utils";

const props = defineProps<{
  show: boolean;
  resource: string;
}>();

const emit = defineEmits<{
  (event: "close"): void;
}>();

const sqlReviewStore = useSQLReviewStore();
const router = useRouter();
const { t } = useI18n();
const me = useCurrentUserV1();

watchEffect(() => {
  sqlReviewStore.fetchReviewPolicyList();
});

const allowCreateSQLReviewPolicy = computed(() => {
  return hasWorkspacePermissionV2(me.value, "bb.policies.create");
});

const createPolicy = () => {
  router.push({
    name: WORKSPACE_ROUTE_SQL_REVIEW_CREATE,
    query: {
      attachedResource: props.resource,
    },
  });
};

const onReviewSelect = async (review: SQLReviewPolicy) => {
  await sqlReviewStore.upsertReviewConfigTag({
    oldResources: [...review.resources],
    newResources: [...review.resources, props.resource],
    review: review.id,
  });
  pushNotification({
    module: "bytebase",
    style: "SUCCESS",
    title: t("common.updated"),
  });
  emit("close");
};
</script>
