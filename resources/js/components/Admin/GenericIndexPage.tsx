import { Head, Link, router } from "@inertiajs/react";
import { AdminLayout } from "@/components/Admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { useState } from "react";

interface GenericIndexPageProps {
  title: string;
  description: string;
  createUrl: string;
  indexUrl: string;
  items: {
    data: any[];
    links: any;
    meta: any;
  };
  filters: {
    search?: string;
    status?: string;
  };
  columns: Array<{
    key: string;
    label: string;
    render?: (item: any) => React.ReactNode;
  }>;
  onDelete: (id: number) => void;
  deleteConfirmMessage: string;
}

export function GenericIndexPage({
  title,
  description,
  createUrl,
  indexUrl,
  items,
  filters,
  columns,
  onDelete,
  deleteConfirmMessage,
}: GenericIndexPageProps) {
  const [search, setSearch] = useState(filters.search || "");
  const [status, setStatus] = useState(filters.status || "all");

  const handleSearch = () => {
    router.get(
      indexUrl,
      { search, status: status !== "all" ? status : undefined },
      { preserveState: true }
    );
  };

  return (
    <AdminLayout>
      <Head title={title} />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{title}</h1>
            <p className="text-muted-foreground mt-2">{description}</p>
          </div>
          <Button asChild>
            <Link href={createUrl}>
              <Plus className="w-4 h-4 ml-2" />
              إضافة جديد
            </Link>
          </Button>
        </div>

        <div className="flex gap-4">
          <Input
            placeholder="بحث..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="max-w-sm"
          />
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="الحالة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">الكل</SelectItem>
              <SelectItem value="published">منشور</SelectItem>
              <SelectItem value="draft">مسودة</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleSearch}>
            <Search className="w-4 h-4 ml-2" />
            بحث
          </Button>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((col) => (
                  <TableHead key={col.key}>{col.label}</TableHead>
                ))}
                <TableHead className="text-left">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} className="text-center">
                    لا توجد عناصر
                  </TableCell>
                </TableRow>
              ) : (
                items.data.map((item) => (
                  <TableRow key={item.id}>
                    {columns.map((col) => (
                      <TableCell key={col.key}>
                        {col.render ? col.render(item) : item[col.key]}
                      </TableCell>
                    ))}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`${indexUrl}/${item.id}/edit`}>
                            <Edit className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            if (confirm(deleteConfirmMessage)) {
                              onDelete(item.id);
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {items.links && (
          <div className="flex justify-center gap-2">
            {items.links.map((link: any, index: number) => (
              <Button
                key={index}
                variant={link.active ? "default" : "outline"}
                disabled={!link.url}
                onClick={() => link.url && router.get(link.url)}
                dangerouslySetInnerHTML={{ __html: link.label }}
              />
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

