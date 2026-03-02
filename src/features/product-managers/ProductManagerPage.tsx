import React from 'react';
import { DataTable } from '../../components/ui/data-table';
import { getManagerColumns } from './productManagerColumns';
import { useProductManagerStore, type ProductManager } from '../../store/productManagerStore';
import { PageContainer } from '../../components/PageContainer';
import { PageHeader } from '../../components/PageHeader';
import AddProductManagerModal from './AddProductManagerModal';
import { useAuthStore } from '../../store/authStore';
import { ReassignUserModal } from '../med-reps/ReassignUserModal';

export default function ProductManagerPage() {
    const { productManagers, fetchProductManagers } = useProductManagerStore();
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [transferUser, setTransferUser] = React.useState<ProductManager | null>(null);

    const currentUser = useAuthStore((state) => state.user);
    const canReassign = currentUser?.role && ['admin', 'director', 'deputy_director'].includes(currentUser.role);

    const columns = React.useMemo(() => getManagerColumns(
        canReassign ? (user) => setTransferUser(user) : undefined
    ), [canReassign]);

    React.useEffect(() => {
        fetchProductManagers();
    }, [fetchProductManagers]);

    return (
        <PageContainer>
            <PageHeader
                title="Менеджеры по продукту"
                description="Управление списком менеджеров по продукции и их ролями."
                buttonLabel="ДОБАВИТЬ"
                onButtonClick={() => setIsModalOpen(true)}
            />

            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border overflow-hidden hover-lift transition-all duration-500">
                <DataTable columns={columns} data={productManagers} searchColumn="name" />
            </div>

            <AddProductManagerModal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
            />

            <ReassignUserModal
                isOpen={!!transferUser}
                onClose={() => {
                    setTransferUser(null);
                    fetchProductManagers();
                }}
                fromUserId={transferUser?.id || 0}
                fromUserName={transferUser?.full_name || "Unknown"}
                role={transferUser?.role || "product_manager"}
            />
        </PageContainer>
    );
}
