import { Ionicons } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import {
  Image,
  ImageSourcePropType,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const DEFAULT_SIZES = ["XS", "S", "M", "L", "XL"] as const;

export interface CartProductProps {
  title: string;
  price: number;
  img: ImageSourcePropType;
  quantity: number;
  size: string;
  availableSizes?: string[];
  onQuantityChange: (quantity: number) => void;
  onSizeChange: (size: string) => void;
  onRemove: () => void;
}

export default function CartProduct({
  title,
  price,
  img,
  quantity,
  size,
  availableSizes = [...DEFAULT_SIZES],
  onQuantityChange,
  onSizeChange,
  onRemove,
}: CartProductProps) {
  const lineTotal = price * quantity;
  const [open, setOpen] = useState<"size" | "quantity" | null>(null);
  const [draftSize, setDraftSize] = useState(size);
  const [draftQty, setDraftQty] = useState(quantity);

  const openSize = useCallback(() => {
    setDraftSize(size);
    setOpen("size");
  }, [size]);

  const openQuantity = useCallback(() => {
    setDraftQty(quantity);
    setOpen("quantity");
  }, [quantity]);

  const close = useCallback(() => setOpen(null), []);

  const applySize = useCallback(() => {
    onSizeChange(draftSize);
    close();
  }, [draftSize, onSizeChange, close]);

  const applyQuantity = useCallback(() => {
    onQuantityChange(Math.min(99, Math.max(1, draftQty)));
    close();
  }, [draftQty, onQuantityChange, close]);

  const bumpQty = useCallback((delta: number) => {
    setDraftQty((q) => Math.min(99, Math.max(1, q + delta)));
  }, []);

  return (
    <View style={styles.card}>
      <View style={styles.leftColumn}>
        <View style={styles.imageWrap}>
          <Image source={img} style={styles.image} resizeMode="contain" />
        </View>

        <View style={styles.pickerRow}>
          <TouchableOpacity
            style={styles.pickerCard}
            onPress={openSize}
            activeOpacity={0.75}
          >
            <View style={styles.pickerCardInner}>
              <Text style={styles.pickerInline} numberOfLines={1}>
                <Text style={styles.pickerPrefix}>SIZE: </Text>
                <Text style={styles.pickerEmphasis}>{size}</Text>
              </Text>
              <Ionicons name="chevron-down" size={14} color="#6B7280" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.pickerCard}
            onPress={openQuantity}
            activeOpacity={0.75}
          >
            <View style={styles.pickerCardInner}>
              <Text style={styles.pickerInline} numberOfLines={1}>
                <Text style={styles.pickerPrefix}>QTY: </Text>
                <Text style={styles.pickerEmphasis}>{quantity}</Text>
              </Text>
              <Ionicons name="chevron-down" size={14} color="#6B7280" />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.body}>
        <View>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          <Text style={styles.metaLine}>
            {size} · Qty {quantity}
          </Text>
          <View style={styles.rowMeta}>
            <Text style={styles.lineTotal}>
              ₹{lineTotal.toLocaleString("en-IN")}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.removeBtn}
          onPress={onRemove}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.removeText}>Remove</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={open === "size"}
        transparent
        animationType="fade"
        onRequestClose={close}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={close} />
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Select size</Text>
            <View style={styles.chipWrap}>
              {availableSizes.map((s) => {
                const selected = draftSize === s;
                return (
                  <TouchableOpacity
                    key={s}
                    style={[styles.chip, selected && styles.chipSelected]}
                    onPress={() => setDraftSize(s)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[styles.chipText, selected && styles.chipTextSelected]}
                    >
                      {s}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalBtnGhost} onPress={close}>
                <Text style={styles.modalBtnGhostText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalBtnPrimary} onPress={applySize}>
                <Text style={styles.modalBtnPrimaryText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={open === "quantity"}
        transparent
        animationType="fade"
        onRequestClose={close}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={close} />
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Quantity</Text>
            <View style={styles.qtyRow}>
              <TouchableOpacity
                style={styles.qtyCircle}
                onPress={() => bumpQty(-1)}
                disabled={draftQty <= 1}
              >
                <Ionicons
                  name="remove"
                  size={22}
                  color={draftQty <= 1 ? "#D1D5DB" : "#111"}
                />
              </TouchableOpacity>
              <Text style={styles.qtyBig}>{draftQty}</Text>
              <TouchableOpacity
                style={styles.qtyCircle}
                onPress={() => bumpQty(1)}
                disabled={draftQty >= 99}
              >
                <Ionicons
                  name="add"
                  size={22}
                  color={draftQty >= 99 ? "#D1D5DB" : "#111"}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.qtyHint}>Max 99 per line</Text>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalBtnGhost} onPress={close}>
                <Text style={styles.modalBtnGhostText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalBtnPrimary}
                onPress={applyQuantity}
              >
                <Text style={styles.modalBtnPrimaryText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    flexDirection: "row",
    alignItems: "stretch",
    gap: 14,
    padding: 14,
    borderRadius: 16,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  leftColumn: {
    width: 128,
    alignItems: "stretch",
  },
  imageWrap: {
    width: 108,
    height: 108,
    alignSelf: "center",
    borderRadius: 14,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  image: {
    width: "92%",
    height: "92%",
  },
  pickerRow: {
    flexDirection: "row",
    marginTop: 10,
    gap: 8,
  },
  pickerCard: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#fff",
  },
  pickerCardInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 6,
    minWidth: 0,
  },
  pickerInline: {
    flexShrink: 1,
    fontSize: 13,
    fontFamily: "SNPro",
  },
  pickerPrefix: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
    fontFamily: "SNPro",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  pickerEmphasis: {
    fontSize: 13,
    fontWeight: "800",
    color: "#111827",
    fontFamily: "SNPro",
  },
  body: {
    flex: 1,
    minWidth: 0,
    justifyContent: "space-between",
    paddingVertical: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    fontFamily: "SNPro",
    lineHeight: 22,
  },
  metaLine: {
    marginTop: 6,
    fontSize: 13,
    color: "#6B7280",
    fontFamily: "SNPro",
  },
  rowMeta: {
    marginTop: 8,
  },
  lineTotal: {
    fontSize: 17,
    fontWeight: "800",
    color: "#111827",
    fontFamily: "SNPro",
  },
  removeBtn: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginTop: 12,
  },
  removeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#DC2626",
    fontFamily: "SNPro",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  modalSheet: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 22,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
    fontFamily: "SNPro",
    marginBottom: 18,
  },
  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 22,
  },
  chip: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FAFAFA",
  },
  chipSelected: {
    borderColor: "#111827",
    backgroundColor: "#111827",
  },
  chipText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#374151",
    fontFamily: "SNPro",
  },
  chipTextSelected: {
    color: "#fff",
  },
  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 28,
    marginBottom: 8,
  },
  qtyCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
  },
  qtyBig: {
    fontSize: 32,
    fontWeight: "800",
    color: "#111827",
    fontFamily: "SNPro",
    minWidth: 48,
    textAlign: "center",
  },
  qtyHint: {
    fontSize: 12,
    color: "#9CA3AF",
    fontFamily: "SNPro",
    textAlign: "center",
    marginBottom: 18,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
  },
  modalBtnGhost: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    alignItems: "center",
  },
  modalBtnGhostText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#374151",
    fontFamily: "SNPro",
  },
  modalBtnPrimary: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: "#111827",
    alignItems: "center",
  },
  modalBtnPrimaryText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#fff",
    fontFamily: "SNPro",
  },
});
